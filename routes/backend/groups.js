var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

var groupModel = require(__base__schemas + 'groups');
var utilsHelpers = require(__base__helpers + 'utils');
const systemConfig = require(__base__config + 'system');
const validator = require(__base__validates + 'groups');
const notify = require(__base__config + 'notify');
let paginationObject = require(__base__config + 'pagination');


const indexLink = `/${systemConfig.prefixAdmin}/groups`;
const pageTitleIndex = 'Groups Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __base__views + 'pages/groups/';


var beginPoint = paginationObject.currentBeginPoint;

router.get('(/status/:status)?', async function(req, res, next) {
    let currentStatus = (req.params.status !== undefined) ? req.params.status : 'all';
    let querySearch = (req.query.search !== undefined) ? req.query.search : '';
    let condition = null;
    let statusFilter = await utilsHelpers.createFilterStatus(currentStatus, 'groups');
    let sortField = (req.session.sortField !== undefined) ? req.session.sortField : 'order';
    let sortType = (req.session.sortType !== undefined) ? req.session.sortType : 'asc';
    let sort = {};
    sort[sortField] = sortType;
    // Get currentPage from request
    paginationObject.currentPage = parseInt((req.query.page !== undefined) ? req.query.page : 1);
    // =========================================================================

    // Calculate a beginning point for pagination button
    if (paginationObject.currentPage < paginationObject.detai[2].quantity) {
        beginPoint = 1
    } else {
        beginPoint = Math.floor(paginationObject.currentPage / paginationObject.detai[2].quantity) * paginationObject.detai[2].quantity;
    }
    paginationObject.currentBeginPoint = beginPoint;
    // =========================================================================

    // build conditions for data query
    let skipPage = (paginationObject.currentPage - 1) * paginationObject.numberItemPerPage;
    if (currentStatus !== 'all') {
        condition = { status: currentStatus };
    }
    if (querySearch !== '') {
        condition = {...condition, name: new RegExp(querySearch, 'i') };
    }
    // =========================================================================
    await groupModel
        .count(condition)
        .then((data) => {
            paginationObject.totalItem = data;
        });

    groupModel
        .find(condition)
        .sort(sort)
        .limit(paginationObject.numberItemPerPage)
        .skip(skipPage)
        .then((data) => {
            res.render(folderView + 'index', {
                title: pageTitleIndex,
                items: data,
                statusFilter,
                currentStatus,
                querySearch,
                paginationObject,
                sortField,
                sortType
            });
        })
});
// update status
router.get('/change-status/:status/:id', function(req, res, next) {
    let currentStatus = (req.params.status !== undefined) ? req.params.status : 'active';
    let id = (req.params.id !== undefined) ? req.params.id : '';
    let modified = {
        user_id: 1,
        user_name: 'thuyduong',
        time: Date.now()
    };
    let newStatus = (currentStatus === 'active') ? 'inactive' : 'active';
    groupModel.update({ _id: id }, { status: newStatus, modified }, () => {
        req.flash('success', notify.notification.SUCCESSFUL_CHANGE_STATUS, false);
        res.redirect(indexLink);
    });
});
// ==========================================================================

// update group_ACP
router.get('/change-groupacp/:groupAcp/:id', function(req, res, next) {
    let currentGroupAcp = (req.params.groupAcp !== undefined) ? req.params.groupAcp : '';
    let id = (req.params.id !== undefined) ? req.params.id : '';
    let modified = {
        user_id: 1,
        user_name: 'thuyduong',
        time: Date.now()
    };
    let newGroupAcp = (currentGroupAcp === 'yes') ? 'no' : 'yes';
    groupModel.update({ _id: id }, { group_acp: newGroupAcp, modified }, () => {
        req.flash('success', notify.notification.SUCCESSFUL_CHANGE_GROUP_ACP, false);
        res.redirect(indexLink);
    });
});
// ==========================================================================

// multiple update status
router.post('/change-status/:status', function(req, res, next) {
    let currentStatus = (req.params.status !== undefined) ? req.params.status : 'active';
    let ids = req.body.cid;
    let modified = {
        user_id: 1,
        user_name: 'thuyduong',
        time: Date.now()
    };
    groupModel.updateMany({ _id: { $in: ids } }, { status: currentStatus, modified }, () => {
        req.flash('success', notify.notification.SUCCESSFUL_UPDATE, false);
        res.redirect(indexLink);
    });
    //res.end();
});
// ==========================================================================

// Delete item
router.get('/delete/:id', function(req, res, next) {
    let id = (req.params.id !== undefined) ? req.params.id : '';
    groupModel.deleteOne({ _id: id }, () => {
        req.flash('success', notify.notification.SUCCESSFUL_DELETE, false);
        res.redirect(indexLink);
    });
});
// ==========================================================================

// multiple delete
router.post('/delete', function(req, res, next) {
    let ids = req.body.cid;
    groupModel.deleteMany({ _id: { $in: ids } }, () => {
        req.flash('success', notify.notification.SUCCESSFUL_DELETE, false);
        res.redirect(indexLink);
    });
    //res.end();
});
// ==========================================================================

// multiple change ordering
router.post('/save-ordering', function(req, res, next) {
    let ids = req.body.cid;
    let orders = req.body.ordering;
    let modified = {
        user_id: 1,
        user_name: 'thuyduong',
        time: Date.now()
    };
    if (Array.isArray(ids)) {
        ids.map((value, index) => {
            groupModel.update({ _id: value }, { order: orders[index], modified }, () => {});
        });
    } else {
        groupModel.update({ _id: ids }, { order: orders, modified }, () => {});
    }
    res.redirect(indexLink);
});
// ==========================================================================
// Open form
router.get('/form(/:id)?', function(req, res, next) {
    let id = (req.params.id !== undefined) ? req.params.id : '';
    let errors = null;
    if (id === '') {
        res.render(folderView + 'form', { title: pageTitleAdd, item: { name: '', status: '', order: '', group_acp: '', content: '' }, errors });
    } else {
        groupModel.findById(id, (err, data) => {
            res.render(folderView + 'form', { title: pageTitleEdit, item: data, errors });
        })
    }
});
// ==========================================================================

// Add or update item
router.post('/save', validator.validateForm, (req, res) => {
    const errorsObject = validationResult(req);
    let item = Object.assign(req.body);
    let id = req.body.id;
    let pageTitle = (id === '') ? pageTitleAdd : pageTitleEdit;
    if (!errorsObject.isEmpty()) {
        res.render(folderView + 'form', { title: pageTitle, item, errors: errorsObject.errors });
    } else {
        let { name, order, status, id, content, group_acp } = req.body;
        if (id === '') {
            let created = {
                user_id: 1,
                user_name: 'thuyduong',
                time: Date.now()
            };
            new groupModel({ name, status, order, created, group_acp, content }).save();
            req.flash('success', notify.notification.SUCCESSFUL_ADD, false);
            res.redirect(indexLink);
        } else {
            let modified = {
                user_id: 1,
                user_name: 'thuyduong',
                time: Date.now()
            };
            let { name, order, status, id, content, group_acp } = req.body;
            groupModel.update({ _id: id }, { name, order, status, modified, group_acp, content }, () => {
                req.flash('success', notify.notification.SUCCESSFUL_UPDATE, false);
                res.redirect(indexLink);
            });
        }

    }
});
// ==========================================================================
// Open form
router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
    req.session.sortField = (req.params.sort_field !== undefined) ? req.params.sort_field : 'order';
    req.session.sortType = (req.params.sort_type !== undefined) ? req.params.sort_type : 'asc';
    res.redirect(indexLink);
});


module.exports = router;
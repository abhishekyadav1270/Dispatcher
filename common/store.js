//const e = require('express');
const moment = require('moment');
const knex = require('knex')(require('./knexfile.js').production);

module.exports = {
    // SDS index
    async sdsIndex() {
        let index = await knex.raw('show index from sdsMessages where Key_name="sdsIndex"');
        if (index.length > 0 && index[0].length > 0) {
            return "SDS index already exist"
        } {
            return knex.schema.alterTable('sdsMessages', (t) => {
                t.index(['toId', 'fromId', 'creatorId'], 'sdsIndex');
            });
        }
    },

    async callIndex() {
        let index = await knex.raw('show index from calls where Key_name="callIndex"');
        if (index.length > 0 && index[0].length > 0) {
            return "Call index already exist"
        } {
            return knex.schema.alterTable('calls', (t) => {
                t.index(['fromId', 'toId'], 'callIndex');
            })
        }
    },

    async alertIndex() {
        let index = await knex.raw('show index from sdsAlerts where Key_name="alertIndex"');
        if (index.length > 0 && index[0].length > 0) {
            return "Alert index already exist"
        } {
            return knex.schema.alterTable('sdsAlerts', (t) => {
                t.index(['fromId', 'toId'], 'alertIndex')
            })
        }
    },

    //FAV CONTACTS
    getAllContactLists() {
        return knex.select('*').from('favContacts').then((rows) => {
            return rows;
        })
            .catch((e) => { return e })
    },
    getContactLists(disp_id) {
        return knex.select('*').from('favContacts').where('dispatcher_id', disp_id)
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return e })
    },
    insertFavContact(data) {
        let insertionData = {
            mcptt_id: data.mcptt_id,
            tetra_id: data.tetra_id,
            dispatcher_id: data.dispatcher_id,
            contactName: data.contactName ? data.contactName : '',
        }
        return knex('favContacts').insert(insertionData)
            .then(() => { return { 'status': 'success', 'msg': 'Added fav successfully' } })
            .catch((e) => { return { 'status': 'failed', 'error': e } })
    },
    removeFromFav(data) {
        return knex('favContacts')
            .where('tetra_id', data.tetra_id.toString()).andWhere('dispatcher_id', data.dispatcher_id.toString()).del()
            .then((rows) => {
                if (!rows) return { status: 'failed', error: 'Could not find matching data' };
                return { status: 'success', msg: 'Deleted fav successfully' }
            })
            .catch((e) => {
                console.log('remove fav contact error', e)
                return { status: 'faileddd', error: e }
            })
    },

    //SDS
    getAllSDS(id, UEid) {
        UEid = UEid ? UEid : '0000';
        return knex.select('*').from('sdsMessages')
            .where('creatorId', id.toString())
            .andWhere('UEid', UEid.toString())
            .orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return [] })
    },
    getIndividualSDS(disp_id, UEid) {
        UEid = UEid ? UEid : '0000';
        return knex.select('*').from('sdsMessages')
            // .where(function () {
            //     this.where('toId', disp_id.toString()).orWhere('fromId', disp_id.toString())
            // })
            .where('creatorId', disp_id.toString())
            .andWhere('UEid', UEid.toString())
            .andWhere('sdsType', 'TEXT_MESSAGE').orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    /*getPrevSDS(disp_id, toId) {
        return knex.select('*').from('sdsMessages')
            .where('creatorId', disp_id.toString())
            .where('sdsType', 'TEXT_MESSAGE')
            .where(function () {
                this.where('toId', toId.toString()).andWhere('fromId', disp_id.toString())
                    .orWhere(function () {
                        this.where('toId', disp_id.toString()).andWhere('fromId', toId.toString())
                    })
            })
            .orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },*/
    getPrevSDS(disp_id, toId, UEid) {
        UEid = UEid ? UEid : '0000';
        return knex.select('*').from('sdsMessages')
            .where(function () {
                this.where('sdsType', 'TEXT_MESSAGE')
                    .orWhere('sdsType', 'GROUP_TEXT_MESSAGE')
                    .orWhere('sdsType', 'STATUS_MESSAGE')
                    .orWhere('sdsType', 'GROUP_STATUS_MESSAGE')
            })
            .where('creatorId', disp_id.toString()).andWhere('UEid', UEid.toString()).andWhere(function () {
                this.where('contactId', toId.toString())
                    .orWhere('contactId', toId.toString() + "-mcptt")
            })
            // .where(function () {
            //     this.where(function () {
            //         this.where('toId', toId.toString()).andWhere('fromId', disp_id.toString())
            //     })
            //         .orWhere(function () {
            //             this.where('toId', disp_id.toString()).andWhere('fromId', toId.toString())
            //         })
            //         .orWhere(function () {
            //             this.where(function () {
            //                 this.where('toId', disp_id.toString()).orWhere('fromId', disp_id.toString())
            //             }).andWhere(function () {
            //                 this.where('groupId', toId.toString()).orWhere('groupId', toId.toString() + "-mcptt")
            //             })
            //         })
            // })
            .orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    async getUserSDS(disp_id, toId, per_page, current_page, UEid) {
        const filtered = await this.getPrevSDS(disp_id, toId, UEid)
        let pagination = {};
        let per_page_int = parseInt(per_page || 10);
        let page = parseInt(current_page) || 1;
        let offset = (page - 1) * per_page_int;
        let to = offset + per_page_int;
        if (page < 1) page = 1;
        let count = filtered.length
        if (count < to) to = count;
        let data = filtered.slice(offset, to);

        pagination.total = count;
        pagination.per_page = per_page_int;
        pagination.offset = offset;
        pagination.to = to;
        pagination.last_page = Math.ceil(count / per_page_int);
        pagination.current_page = page;
        pagination.from = offset;
        pagination.data = data;
        return pagination;
    },
    getUnreadSDS(disp_id, UEid) {
        UEid = UEid ? UEid : '0000';
        return knex.select('*').from('sdsMessages')
            .where('creatorId', disp_id.toString())
            .where('UEid', UEid.toString())
            .andWhere('sendReceive', 'Receive')
            .andWhere('sdsType', 'TEXT_MESSAGE')
            .orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },

    getGroupSDS(disp_id, UEid) {
        UEid = UEid ? UEid : '0000';
        return knex.select('*').from('sdsMessages')
            .where('creatorId', disp_id.toString())
            .andWhere('UEid', UEid.toString())
            .andWhere('sdsType', 'GROUP_TEXT_MESSAGE').orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    insertNewSDS(data) {
        const dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        let insertionData = {
            id: data.indexId,
            messageId: data.messageId,
            message: data.message,
            toId: data.toId,
            fromId: data.fromId,
            groupId: data.groupId ? data.groupId : '',
            consumedReportNeeded: data.consumedReportNeeded ? true : false,
            deliveryReportNeeded: data.deliveryReportNeeded ? true : false,
            immediate: data.immediate ? true : false,
            sdsType: data.sdsType,
            communicationType: data.communicationType,
            created: data.created ? data.created : dateNow,
            stateType: data.stateType ? data.stateType : 'PERSISTED',
            creatorId: data.creatorId,
            messageType: data.messageType ? data.messageType : 'text',
            fileId: data.fileId ? data.fileId : '',
            view: data.view,
            UEid: data.UEid ? data.UEid : '0000',
            sendReceive: (data.creatorId == data.toId ? 'Receive' : 'Send'),
            contactId: (data.groupId ? data.groupId : (data.creatorId == data.toId ? data.fromId : data.toId))
        }
        return knex('sdsMessages').insert(insertionData)
            .then(() => { return { status: 'success', msg: 'SDS logged successfully' } })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    insertOrUpdateSDS(data) {
        const dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        let insertionData = {
            id: data.indexId,
            messageId: data.messageId,
            message: data.message,
            toId: data.toId,
            fromId: data.fromId,
            groupId: data.groupId ? data.groupId : '',
            consumedReportNeeded: data.consumedReportNeeded ? true : false,
            deliveryReportNeeded: data.deliveryReportNeeded ? true : false,
            immediate: data.immediate ? true : false,
            sdsType: data.sdsType,
            communicationType: data.communicationType,
            created: data.created ? data.created : dateNow,
            stateType: data.stateType ? data.stateType : 'PERSISTED',
            creatorId: data.creatorId,
            UEid: data.UEid ? data.UEid : '0000',
            sendReceive: (data.creatorId == data.toId ? 'Receive' : 'Send'),
            contactId: (data.groupId ? data.groupId : (data.creatorId == data.toId ? data.fromId : data.toId))
        }
        return knex('sdsMessages').update({ stateType: data.stateType, read_at: dateNow }).where({ 'messageId': insertionData.messageId })
            .then((rows) => {
                console.log(rows)
                if (!rows) {
                    knex('sdsMessages').insert(insertionData)
                        .then((row) => { return { status: "Success", msg: "SDS logged successfully" } })
                        .catch((err) => { return { status: "failed", error: err } })
                }
                return { status: "Success", msg: "SDS logged Successfully" }
            })
            .catch((err) => { return { status: "failed", error: err } })

    },
    updateSDSstate(data) {
        if (data.stateType === 'READ') {
            const dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            return knex('sdsMessages').where({ 'sdsType': data.sdsType, 'messageId': data.messageId })
                .update({ stateType: data.stateType, read_at: dateNow, view: true })
                .then((rows) => {
                    if (!rows) return { status: 'failed', error: 'No SDS exist with provided indexId' };
                    return { status: 'success', msg: 'SDS updated successfully' }
                })
                .catch((e) => { return { status: 'failed', error: e } })
        }
        else if (data.stateType === 'DELETE') {
            return knex('sdsMessages').where({ 'messageId': data.messageId })
                .update({ stateType: data.stateType })
                .then(() => { return { status: 'success', msg: 'SDS deleted successfully' } })
                .catch((e) => { return { status: 'failed', error: e } })
        }
        else {
            return knex('sdsMessages').where({ 'sdsType': data.sdsType, 'messageId': data.messageId })
                .update({ stateType: data.stateType })
                .then(() => { return { status: 'success', msg: 'SDS updated successfully' } })
                .catch((e) => { return { status: 'failed', error: e } })
        }
    },
    //Alerts
    getAllAlerts(id) {
        return knex.select('*').from('sdsAlerts')
            .where('toId', id).orWhere('fromId', id)
            .order('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return [] })
    },
    getAlerts(disp_id) {
        return knex.select('*').from('sdsAlerts')
            .where(function () {
                this.where('toId', disp_id).orWhere('fromId', disp_id)
            })
            .andWhere('sdsType', 'STATUS_MESSAGE').orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    getGroupAlerts(disp_id) {
        return knex.select('*').from('sdsAlerts')
            .where(function () {
                this.where('toId', disp_id).orWhere('fromId', disp_id)
            })
            .andWhere('sdsType', 'GROUP_STATUS_MESSAGE').orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    //PAGINATION QUERIES
    async getActivityLogs(id, type, pr_page, current_page, search = '') {
        //console.log(id, type, pr_page, current_page, type === "calls")
        let filtered = [];
        if (type === "calls") {
            filtered = await this.getAllCalls(id);
        } else if (type === "sds") {
            filtered = await this.getAllSDS(id);
        } else if (type === "alerts") {
            filtered = await this.getAllAlerts(id);
        } else if (type === "all") {
            let calls = await this.getAllCalls(id);
            let sds = await this.getAllSDS(id);
            let alerts = await this.getAllAlerts(id);
            filtered = [...calls, ...sds, ...alerts];
            //filtered = await this.getAllLogs(id);
        }
        /*let all = [...calls, ...sds, ...alerts];
        if (type === "calls") filtered = calls.sort((a, b) => new Date(b.created) - new Date(a.created))
        if (type === "sds") filtered = sds.sort((a, b) => new Date(b.created) - new Date(a.created))
        if (type === "alerts") filtered = alerts.sort((a, b) => new Date(b.created) - new Date(a.created))
        if (type === "all") filtered = all.sort((a, b) => new Date(b.created) - new Date(a.created))
        if (search.length > 0) {
            filtered = filtered.filter(cont =>
                cont.fromId.toLowerCase().includes(search.toLowerCase()) ||
                cont.toId.toLowerCase().includes(search.toLowerCase()))
        }*/

        var pagination = {};
        var per_page = parseInt(pr_page || 10);
        var page = parseInt(current_page) || 1;
        var offset = (page - 1) * per_page;
        var to = offset + per_page;
        if (page < 1) page = 1;
        var count = filtered.length
        if (count < to) to = count;
        var data = filtered.slice(offset, to);

        pagination.total = count;
        pagination.per_page = per_page;
        pagination.offset = offset;
        pagination.to = to;
        pagination.last_page = Math.ceil(count / per_page);
        pagination.current_page = page;
        pagination.from = offset;
        pagination.data = data;
        return pagination;
    },

    getLogs(id, type, fromDate, toDate, UEid) {
        UEid = UEid ? UEid : '0000';
        if (type === 'calls') {
            return knex('calls').select(['communicationType', 'callType', 'toId', 'fromId', 'groupId', 'created', 'callPriority', 'stateType']).where(function () {
                this.where('toId', id).orWhere('fromId', id)
            }).whereBetween('created', [moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(toDate + ' 23:59:59')).format('YYYY-MM-DD HH:mm:ss')]).orderBy('created', 'desc').then((data) => {
                return data;
            })
        }
        else if (type === "sds") {
            return knex('sdsMessages').select(['communicationType', 'sdsType', 'toId', 'fromId', 'groupId', 'created', 'message', 'stateType']).where(function () {
                this.where('creatorId', id.toString()).andWhere('UEid', UEid.toString())
            }).whereBetween('created', [moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(toDate + ' 23:59:59')).format('YYYY-MM-DD HH:mm:ss')]).orderBy('created', 'desc')

        }
        else if (type === 'alerts') {
            return knex('sdsAlerts').select(['communicationType', 'sdsType', 'toId', 'fromId', 'groupId', 'created', 'tetraCode', 'stateType']).where(function () {
                this.where('toId', id).orWhere('fromId', id)
            }).whereBetween('created', [moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(toDate + ' 23:59:59')).format('YYYY-MM-DD HH:mm:ss')]).orderBy('created', 'desc')
        }
        else if (type === 'all') {
            return knex.select(['c.fromId', 'c.toId', 'c.groupId', 'c.communicationType', 'c.created', 'c.callType', 'c.callPriority', 'c.stateType']).from({ 'c': 'calls' })
                .where(function () {
                    this.where('toId', id).orWhere('fromId', id)
                }).whereBetween('created', [moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(toDate + ' 23:59:59')).format('YYYY-MM-DD HH:mm:ss')])
                .unionAll(function () {
                    this.select(['m.fromId', 'm.toId', 'groupId', 'm.communicationType', 'm.created', 'm.sdsType', 'm.message', 'm.stateType']).from({ 'm': 'sdsMessages' })
                        .where(function () {
                            this.where('creatorId', id.toString()).andWhere('UEid', UEid.toString())
                        }).whereBetween('created', [moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(toDate + ' 23:59:59')).format('YYYY-MM-DD HH:mm:ss')])
                })
                // .unionAll(function () {
                //     this.select(['a.fromId', 'a.toId', 'a.groupId', 'a.communicationType', 'a.created', 'a.sdsType', 'a.tetraCode', 'm.stateType']).from({ 'a': 'sdsAlerts' })
                //         .where(function () {
                //             this.where('toId', id).orWhere('fromId', id)
                //         }).whereBetween('created', [moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(toDate + ' 23:59:59')).format('YYYY-MM-DD HH:mm:ss')])
                // })
                .orderBy('created', 'DESC')
        }
        else {
            return "Invalid type argument";
        }
    },

    getTypeAlerts(id, type) {
        if (type === 'ack') {
            return knex.select('*').from('sdsAlerts')
                .where(function () {
                    this.where('toId', id).andWhere('stateType', "ACKNOWLEDGED")
                })
                .orderBy('created', 'desc')
                .then((rows) => { return rows })
                .catch(e => { return [] })
        }
        else if (type === 'inc') {
            return knex.select('*').from('sdsAlerts')
                .where(function () {
                    this.where('toId', id).andWhere('stateType', "PERSISTED")
                })
                .orderBy('created', 'desc')
                .then((rows) => { return rows })
                .catch(e => { return [] })
        }
        else if (type === 'sent') {
            return knex.select('*').from('sdsAlerts')
                .where('fromId', id).andWhere(function () {
                    this.whereNotIn('stateType', ['ACKNOWLEDGED', 'IGNORED'])
                })
                .orderBy('created', 'desc')
                .then((rows) => { return rows })
                .catch(e => { return [] })
        }
        else if (type === 'emergency') {
            return knex.select('*').from('sdsAlerts')
                .where(function () {
                    this.where('toId', id).andWhere('stateType', "PERSISTED")
                })
                .orderBy('created', 'desc')
                .then((rows) => { return rows })
                .catch(e => { return [] })
        }
        else {
            return []
        }
    },

    async getAlertsPagn(disp_id, type, pr_page, current_page) {
        const filtered = await this.getTypeAlerts(disp_id, type)
        var pagination = {};
        var per_page = parseInt(pr_page || 10);
        var page = parseInt(current_page) || 1;
        var offset = (page - 1) * per_page;
        var to = offset + per_page;
        if (page < 1) page = 1;
        var count = filtered.length
        if (count < to) to = count;
        var data = filtered.slice(offset, to);

        pagination.total = count;
        pagination.per_page = per_page;
        pagination.offset = offset;
        pagination.to = to;
        pagination.last_page = Math.ceil(count / per_page);
        pagination.current_page = page;
        pagination.from = offset;
        pagination.data = data;
        return pagination;
    },

    getTypeSDS(id, type, UEid) {
        if (type === 'inbox') {
            return knex.select('*').from('sdsMessages')
                .where('sendReceive', 'Receive')
                .andWhere('UEid', UEid.toString())
                .andWhere('creatorId', id.toString())
                .orderBy('created', 'desc')
                .then((rows) => {
                    const unread = rows.filter(message => message.stateType !== 'READ' && message.stateType !== 'DELETE').sort((a, b) => new Date(b.created) - new Date(a.created))
                    //const read = rows.filter(message => message.stateType === 'READ' && message.stateType !== 'DELETE').sort((a, b) => new Date(b.created)-new Date(a.created))
                    // const rebuilt = [...unread,...read];
                    // return rebuilt
                    return unread
                })
                .catch(e => { return [] })
        }
        if (type === 'sent') {
            return knex.select('*').from('sdsMessages')
                .where('sendReceive', 'Send').whereNot('stateType', 'DELETE')
                .andWhere('UEid', UEid.toString())
                .andWhere('creatorId', id.toString())
                .orderBy('created', 'desc')
                .then((rows) => { return rows })
                .catch(e => { return [] })
        }
        if (type === 'read') {
            return knex.select('*').from('sdsMessages')
                .where('sendReceive', 'Receive').andWhere('stateType', "READ")
                .andWhere('UEid', UEid.toString())
                .andWhere('creatorId', id.toString())
                .orderBy('created', 'desc')
                .then((rows) => { return rows })
                .catch(e => { return [] })
        }
        else {
            return []
        }
    },

    async getSDSPagn(disp_id, type, pr_page, current_page, UEid) {
        UEid = UEid ? UEid : '0000';
        const filtered = await this.getTypeSDS(disp_id, type, UEid)
        var pagination = {};
        var per_page = parseInt(pr_page || 10);
        var page = parseInt(current_page) || 1;
        var offset = (page - 1) * per_page;
        var to = offset + per_page;
        if (page < 1) page = 1;
        var count = filtered.length
        if (count < to) to = count;
        var data = filtered.slice(offset, to);

        pagination.total = count;
        pagination.per_page = per_page;
        pagination.offset = offset;
        pagination.to = to;
        pagination.last_page = Math.ceil(count / per_page);
        pagination.current_page = page;
        pagination.from = offset;
        pagination.data = data;
        return pagination;
    },

    insertNewSDSAlert(data) {
        const dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        let insertionData = {
            id: data.indexId,
            tetraCode: data.tetraCode,
            toId: data.toId,
            fromId: data.fromId,
            groupId: data.groupId ? data.groupId : '',
            sdsType: data.sdsType,
            communicationType: data.communicationType,
            created: data.created ? data.created : dateNow,
            stateType: data.stateType ? data.stateType : 'PERSISTED',
            pinned: false
        }
        return knex('sdsAlerts').insert(insertionData)
            .then(() => { return { status: 'success', msg: 'Alert logged successfully' } })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    updateAlertstate(data) {
        return knex('sdsAlerts').where({ 'id': data.indexId, 'sdsType': data.sdsType, 'fromId': data.toId })
            .update({ stateType: data.stateType })
            .then((rows) => {
                if (!rows) return { status: 'failed', error: 'No ALert exist with provided indexId' };
                return { status: 'success', msg: 'Alert updated successfully' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    pinAlert(data) {
        return knex('sdsAlerts').where({ 'id': data.indexId, 'sdsType': data.sdsType, 'fromId': data.fromId, 'toId': data.toId })
            .update({ pinned: data.pinned })
            .then((rows) => {
                if (!rows) return { status: 'failed', error: 'No ALert exist with provided indexId' };
                return { status: 'success', msg: 'Alert pinned successfully' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    //CALLS
    getAllCalls(id) {
        return knex.select('*').from('calls')
            .where('creatorId', id)
            .orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return [] })
    },

    getAllLogs(id) {
        return knex.select('fromId', 'toId', 'groupId', 'communicationType', 'created', 'stateType').from('calls')
            .unionAll(function () {
                this.select('fromId', 'toId', 'groupId', 'communicationType', 'created', 'stateType').from('sdsMessages'),
                    this.select('fromId', 'toId', 'groupId', 'communicationType', 'created', 'stateType').from('sdsAlerts')
            }).then((rows) => {
                return { status: 'success', logs: rows }
            })
            .catch((e) => { return { status: 'failed', logs: [] } })

        // return knex.select('*')
        // .from(function() {
        //   this.select('fromId', 'toId', 'groupId', 'communicationType', 'created', 'stateType').from('calls')
        //   .unionAll(
        //     this.select('fromId', 'toId', 'groupId', 'communicationType', 'created', 'stateType').from('sdsMessages'),
        //     this.select('fromId', 'toId', 'groupId', 'communicationType', 'created', 'stateType').from('sdsAlerts')
        // ).as('x')
        // }).orderBy('created', 'desc')
        // .then((rows) => {
        //     return { status: 'success', logs: rows }
        // })
        // .catch((e) => { return { status: 'failed', logs: [] } })
    },

    deleteCallLogs(olderDays) {
        return knex('calls').where('created', '>', UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL, olderDays, DAY)))
            .del()
            .then((rows) => {
                return { status: 'success', msg: 'deleted successfully!' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },

    deleteSDSLogs(olderDays) {
        return knex('sdsMessages').where('created', '>', UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL, olderDays, DAY)))
            .del()
            .then((rows) => {
                return { status: 'success', msg: 'deleted successfully!' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },

    deleteAlertsLogs(olderDays) {
        return knex('sdsAlerts').where('created', '>', UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL, olderDays, DAY)))
            .del()
            .then((rows) => {
                return { status: 'success', msg: 'deleted successfully!' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },

    async deleteOlderAllLogs(olderDays) {
        await deleteCallLogs(olderDays)
        await deleteSDSLogs(olderDays)
        await deleteAlertsLogs(olderDays)
        return { status: 'success', msg: 'deleted successfully!' }
    },

    getIndvCalls(disp_id) {
        return knex.select('*').from('calls')
            .where(function () {
                this.where('toId', disp_id).orWhere('fromId', disp_id)
            })
            .andWhere(function () {
                this.whereIn('callType', ['DUPLEX_INDIVIDUAL_CALL', 'SIMPLEX_INDIVIDUAL_HOOK_CALL', 'SIMPLEX_INDIVIDUAL_DIRECT_CALL', 'AMBIENT_LISTENING_CALL'])
            })
            .orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    getGroupCalls(disp_id) {
        return knex.select('*').from('calls')
            .where(function () {
                this.where('toId', disp_id).orWhere('fromId', disp_id)
            })
            .andWhere(function () {
                this.whereIn('callType', ['SIMPLEX_BROADCAST_GROUP_CALL', 'SIMPLEX_GROUP_CALL'])
            })
            .orderBy('created', 'desc')
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    addNewcall(data) {
        const dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        let insertionData = {
            callId: data.callId || '',
            indexId: data.indexId || '',
            toId: data.toId,
            fromId: data.fromId,
            groupId: data.groupId || '',
            callType: data.callType,
            communicationType: data.communicationType,
            callActionType: data.callActionType,
            callPriority: data.callPriority,
            created: data.created || dateNow,
            stateType: data.stateType || 'PERSISTED',
            creatorId: data.creatorId ? data.creatorId : '',
            UEid: data.UEid ? data.UEid : '0000',
        }
        return knex('calls').insert(insertionData)
            .then(() => { return { status: 'success', msg: 'Call logged successfully' } })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    updateCallstate(data) {
        return knex('calls').where({ 'callId': data.callId })
            .update({ stateType: data.stateType, callActionType: data.callActionType })
            .then((rows) => {
                if (!rows) return { status: 'failed', error: 'No call exist with provided callId' };
                return { status: 'success', msg: 'Call updated successfully', data: rows }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    getCallState(callId) {
        return knex.select('*').from('calls')
            .where({ 'callId': callId })
            .then((rows) => {
                if (!rows) return { status: 'failed', calls: [], error: 'this call id not found' };
                return { status: 'success', calls: rows }
            })
            .catch((e) => { return { status: 'failed', calls: [], error: e } })
    },

    //DGNA
    getDGNAlists(disp_id) {
        return knex.select('*').from('attachedDGNA')
            .where('dispatcher_id', disp_id).orderBy('dgId', 'desc')
            .then((rows) => {
                console.log(rows)
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    insertDGNA(data) {
        let insertionData = {
            dispatcher_id: data.id,
            dgnaGroupId: data.dgnaGroupId,
            name: data.name,
            color: data.color,
            grpMembers: data.grpMembers,
            attached: data.attached || false
        }
        return knex.select('*').from('attachedDGNA')
            .where('dispatcher_id', data.id).andWhere('dgnaGroupId', data.dgnaGroupId)
            .then((rows) => {
                if (rows.length === 0) {
                    return knex('attachedDGNA').insert(insertionData)
                        .then(() => { return { status: 'success', msg: 'DGNA created successfully' } })
                        .catch((e) => { return { status: 'failed', error: e } })
                }
                else return { status: 'failed', msg: 'data already exist for ssId' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    updateDGNA(data) {
        return knex('attachedDGNA').where({ 'dispatcher_id': data.dispId, 'dgnaGroupId': data.dgnaGroupId })
            .update({ name: data.name, grpMembers: data.grpMembers, color: data.color })
            .then((rows) => {
                if (!rows) return { status: 'failed', msg: 'No DGNA group can be found' };
                return { status: 'success', msg: 'DGNA group successfully updated!' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    deleteDGNA(data) {
        return knex('attachedDGNA').where({ 'dispatcher_id': data.dispId, 'dgnaGroupId': data.dgnaGroupId })
            .del()
            .then((rows) => {
                if (!rows) return { status: 'failed', msg: 'No DG can be found' };
                return { status: 'success', msg: 'deleted successfully!' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },

    getUserlists(disp_id) {
        return knex.select('*').from('savedUserLists')
            .where('dispatcher_id', disp_id)
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    insertLists(data) {
        let insertionData = {
            dispatcher_id: data.id,
            name: data.name,
            grpMembers: data.grpMembers,
        }
        return knex.select('*').from('savedUserLists')
            .where('dispatcher_id', data.id).andWhere('name', data.name)
            .then((rows) => {
                if (rows.length === 0) {
                    return knex('savedUserLists').insert(insertionData)
                        .then(() => { return { status: 'success', msg: 'List exported successfully' } })
                        .catch((e) => { return { status: 'failed', error: e } })
                }
                else return { status: 'failed', msg: 'List already exported with same name' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    updateLists(data) {
        return knex('savedUserLists').where({ 'dispatcher_id': data.dispId, 'id': data.id })
            .update({ name: data.name, grpMembers: data.grpMembers })
            .then((rows) => {
                if (!rows) return { status: 'failed', msg: 'No List can be found' };
                return { status: 'success', msg: 'User list successfully updated!' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },

    deleteLists(data) {
        return knex('savedUserLists').where({ 'dispatcher_id': data.dispId, 'id': data.id })
            .del()
            .then((rows) => {
                if (!rows) return { status: 'failed', msg: 'No List can be found' };
                return { status: 'success', msg: 'deleted successfully!' }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },

    // file uploading query
    uploadFiles(data) {
        let insertionData = {
            fileId: data.fileId,
            fileName: data.name,
            fileType: data.fileType,
            filePath: data.path
        }
        console.log(insertionData);
        return knex('sdsFiles').insert(insertionData)
            .then(() => { return { status: 'success', File: insertionData } })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    getFiles(fileId) {
        console.log('fileId store..', fileId)
        return knex.select('*').from('sdsFiles')
            .where('fileId', '=', fileId)
            .then((rows) => {
                return rows;
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },
    deleteOldCallLogs(duration) {
        let newDuration = moment(new Date() - duration * 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
        return knex.from('calls').where('created', '<', newDuration)
            .del()
            .then((rows) => {
                return { status: 'success', msg: 'deleted successfully!' }
            })
            .catch((err) => {
                return { status: 'failed', error: err }
            })
    },
    async countUnreadSDS(id, UEid) {
        UEid = UEid ? UEid : '0000';
        try {
            let data = await knex.select('fromId', 'stateType', 'groupId', 'sdsType')
                .where('creatorId', id.toString())
                .andWhere('UEid', UEid.toString())
                .andWhere('sendReceive', 'Receive')
                .where('view', false)
                .from('sdsMessages');
            result = {};
            data.forEach(element => {
                if (element.sdsType === "GROUP_TEXT_MESSAGE") {
                    if (isNaN(result[element.groupId]))
                        result[element.groupId] = 1;
                    else
                        result[element.groupId]++;
                }
                else if (element.sdsType === "TEXT_MESSAGE") {
                    if (isNaN(result[element.fromId]))
                        result[element.fromId] = 1;
                    else
                        result[element.fromId]++;
                }
            })
            data = [];
            for (const key in result) {
                data.push({ mcptt_id: key, unread: result[key] })
            }
            return { status: "success", data: data };
        } catch (err) { return { status: "failed", error: err } }
    },
    updateSDSView(messageId, dispId, UEid) {
        UEid = UEid ? UEid : '0000';
        console.log(messageId)
        let dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        return knex('sdsMessages').whereIn('messageId', messageId).andWhere('creatorId', dispId.toString()).andWhere('UEid', UEid.toString()).andWhere('sendReceive', 'Receive').update({ view: true, read_at: dateNow, stateType: "READ" })
            .then((rows) => {
                // console.log(rows);
                if (!rows) return { status: 'failed', error: 'No SDS exist with provided messageId' };
                return { status: 'success', msg: `${rows} message viewed` }
            })
            .catch((e) => { return { status: 'failed', error: e } })
    },

    async deleteOldLogs(duration) {
        let newDuration = moment(new Date() - duration * 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
        try {
            let data = 0;
            await knex('calls').where('created', '<', newDuration).del().then((temp_data) => data += temp_data);
            await knex('sdsMessages').where('created', '<', newDuration).del().then((temp_data) => data += temp_data);
            await knex('sdsAlerts').where('created', '<', newDuration).del().then((temp_data) => data += temp_data);
            return { status: "Success", msg: "Deleted " + data + " records" };
        }
        catch (err) {
            return { status: "failed", error: err };
        }
    },

    getUserChatList(dispId, ueId){
        console.log("sdhhjyj", dispId, ueId);
        return knex(knex('sdsMessages').where('creatorId',dispId).andWhere('UEid', ueId).orderBy('created','desc').as('chatList')).select('contactId').groupBy('contactId')
        .then((rows)=>{
            console.log(rows);
            return rows;
        })
        .catch((err)=>{
            console.log("Error in getting user chat list",err);
            return [];
        })
    },

    getSdsByUser(dispId,ueId){
        return knex('sdsMessages').select('*').where('creatorId',dispId).andWhere('UEid',ueId).orderBy('created','desc')
        .then((rows)=>{
            return rows
        })
        .catch((err)=>{
            console.log("Errorn in getting sds", err);
            return []
        })
    },
}
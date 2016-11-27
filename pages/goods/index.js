const App = getApp()

Page({
    data: {
        hidden: !0,
        type  : null,
        goods : {},
    },
    onLoad(option) {
        this.setData({
            type: option.type
        })
    },
    onShow() {
        this.onPullDownRefresh()
    },
    initData() {
        const type = this.data.type

        this.setData({
            goods: {
                items: [],
                params: {
                    page : 1,
                    limit: 10,
                    type : type,
                },
                paginate: {}
            }
        })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods-detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    getGoods() {
        const goods = this.data.goods
        const params = goods.params

        this.setData({ 
            hidden: !1
        })

        App.HttpService.getGoods(params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
                goods.items = goods.items.concat(data.data.items)
                goods.paginate = data.data.paginate
                goods.params.page = data.data.paginate.next
                goods.params.limit = data.data.paginate.perPage
                this.setData({
                    goods: goods
                })
            }

            this.setData({ 
                hidden: !0
            })
        })
    },
    onPullDownRefresh() {
        this.initData()
        this.getGoods()
    },
    onReachBottom() {
        this.lower()
    },
    lower() {
        if (!this.data.goods.paginate.hasNext) return
        this.getGoods()
    },
})
import {getRequest} from "./api";


export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest('/system/config/menu').then(data => {
        if (data) {
            let routes = fmtRouter(data.obj)
            router.addRoutes(routes)
            store.commit('initRoutes', routes)
        }
    })
}

export const fmtRouter = (data) => {
    let routes = []
    data.forEach(router => {
        let {
            path,
            name,
            iconcls,
            component,
            meta,
            children
        } = router
        if (children && children instanceof Array) {
            children = fmtRouter(children)
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconcls,
            meta: meta,
            children: children,
            component(resolve) {
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve)
                } else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve)
                } else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve)
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve)
                }
            }
        }
        routes.push(fmRouter)
    })
    return routes;
}
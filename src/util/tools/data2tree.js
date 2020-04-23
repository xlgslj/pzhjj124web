export function data2tree (data, rid, rname, rpid, other) {
  let treedata = []
  let root = {
    id: rid,
    name: rname,
    pid: rpid,
    lb:'菜单',
    view:'',
    viewpath:'',
    page:'',
    scope:'',
    isapp:'否',
    children: []
  }
  Object.assign(root, other || {})
  let m1 = []
  data.forEach(item => {
    if (item.pid === root.id) {
      m1.push(Object.assign({},{id:item.id,name:item.name,pid:item.pid,lb:item.lb,sort:item.sort,view:item.view,viewpath:item.viewpath,page:item.page,scope:item.scope,isapp:item.isapp}))
    }
  })
  m1.forEach(item1 => {
    let m2 = data.filter(item2 => {
      return item1.id === item2.pid
    }).map(x => {
      return Object.assign({},{id:x.id,name:x.name,pid:x.pid,lb:x.lb,sort:x.sort,view:x.view,viewpath:x.viewpath,page:x.page,scope:x.scope,isapp:x.isapp})
    })
    m2.forEach(item3 => {
      let m3 = data.filter(item4 => {
        return item4.pid === item3.id
      }).map(x => {
        return Object.assign({},{id:x.id,name:x.name,pid:x.pid,lb:x.lb,sort:x.sort,view:x.view,viewpath:x.viewpath,page:x.page,scope:x.scope,isapp:x.isapp})
      })
      item3.children = m3
    })
    item1.children = m2
  })
  root.children = m1
  treedata.push(root)
  return treedata
}

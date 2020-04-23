/**
 * 生成单位树形结构，{value:1,label:'xx',children:[]}
 */
export function getTree (data, pid, keyfiled = 'id', labelfiled = 'name') {
    let result = []
    let temp
    for (let i = 0; i < data.length; i++) {
        if (data[i].pid == pid) {
            temp = getTree(data, data[i].id)
            let v = Object.assign({...data[i]}, {key: data[i][keyfiled], label: data[i][labelfiled]})
            if (temp.length > 0) {
                v["children"] = temp
            }
            result.push(v)
        }
    }
    return result
}
/**
 * 如何生成唯一标识符UUID
 */
export function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
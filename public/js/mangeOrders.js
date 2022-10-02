
const cancelOrder= target =>{
    fetch('/admin/order-cancel',{
        method:'post',
        headers:{ 'Content-Type':'application/json' },
        body : JSON.stringify({id : target.value})
    }).then(res=>{if(res.status === 201) location.reload()})
}
const changeOrder= target =>{
    let newStatus = target.parentElement.previousElementSibling.children.status.firstChild.value;
    fetch('/admin/order-change',{
        method:'post',
        headers:{ 'Content-Type':'application/json' },
        body : JSON.stringify({id : target.value, newStatus: newStatus})
    }).then(res=>{if(res.status === 201) location.reload()})
}
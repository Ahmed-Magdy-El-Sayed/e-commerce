
const deleteProduct= target =>{
    fetch('/cart/delete',{
        method:'post',
        headers:{ 'Content-Type':'application/json' },
        body : JSON.stringify({id : target.value})
    }).then(()=>{location.reload()})
}
let product ;
let deleteProductBtn;
const buyProduct = target=>{
    deleteProductBtn = target.parentElement.children[1]
    product = JSON.parse(target.value);
    document.querySelector(".modal-title").innerText =`Buy ${product.name}`;
    document.querySelector(".modal .qnt").innerText =`quantity: ${product.qnt}`;
    document.querySelector(".modal .price").innerText =`Total price: ${product.price}`;
}
document.querySelector(".modal-footer .order").onclick= () =>{
    let {_id, __v, timestamp, ...order} = product
    order.timestamp = new Date().toLocaleString('en-us');
    order.address= document.querySelector(".modal .address").value
    fetch('/order',{
        method: 'post',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(order)
    }).then(res=>{
        if(res.status === 201) deleteProductBtn.click();
    })

}
if(document.querySelector('.forNotAdmins') && !document.querySelector('.alert')){
    document.querySelector('.add-to-cart .add').onclick= e=>{
        e.preventDefault();
        let isLoggedin = Number(e.target.value);
        if(isLoggedin){
            let product = document.querySelector('.add-to-cart input[type="hidden"]').value;
            let qnt = Number(document.querySelector('.add-to-cart input[name="qnt"]').value);
            product = JSON.parse(product)
            const data ={
                productID:product._id,
                name:product.name,
                qnt:qnt,
                type:product.type,
                price: Number(product.price) * qnt
            }
            fetch('/cart',
                {
                method:'post',
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(data)
                }
            ).then(res=>{if(res.status === 201) location.reload()})
        }else{
            alert('Login first');
        }
    };
    if(document.querySelector('.comments .edit-comment')){
        document.querySelector('.comments .edit-comment').onclick= e=>{
            let data = JSON.parse(e.target.value);
            const rating = document.querySelector('.edit-form input[name="rating"]:checked').value;
            const title = e.target.parentElement.children.title.value;
            const body = e.target.parentElement.children.body.value;
            if(data.comment.rating !== rating || data.comment.title !== title || data.comment.body !== body){
                data.comment.rating = rating
                data.comment.title = title
                data.comment.body = body
                data = JSON.stringify(data)
                fetch('/product/comments/edit',{
                    method:'post',
                    headers:{'Content-Type':'application/json'},
                    body: data
                }).then(res=>{
                    res.status === 201 ? location.reload() : console.log(res.body);
                })
            }
        };
    }
    document.querySelector('.comments .delete-comment').onclick= e=>{
        const data = JSON.stringify(JSON.parse(e.target.value));
        fetch('/product/comments/delete',{
            method:'post',
            headers:{'Content-Type':'application/json'},
            body: data
        }).then(res=>{
            res.status === 201 ? location.reload() : console.log(res.body);
        })
    }
}else if(document.querySelector('.forAdmins')){
    document.querySelector('.container .edit-product').onclick= e=>{
        const p =JSON.parse(e.target.value); 
        const nameFelid = e.target.parentElement.children.name.value
        const detailsFelid = e.target.parentElement.children.details.value
        const rateFelid = e.target.parentElement.children.rate.value
        const priceFelid = document.querySelector('.container .input-group').children.price.value
        const id = p._id;
        const data ={}
        if(p.name !== nameFelid) data.name = nameFelid;
        if(p.details !== detailsFelid) data.details = detailsFelid;
        if(p.rate !== Number(rateFelid)) data.rate = rateFelid;
        if(p.price !== Number(priceFelid)) data.price = priceFelid;
        fetch('/Admin/edit-product',
            {
            method:'post',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({id: id,newProduct: data})
            }
        ).then(()=>location.reload())
    }
    document.querySelector('.container .delete-product').onclick= e=>{
        fetch('/Admin/delete-product',
            {
            method:'post',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({id: JSON.parse(e.target.value)._id, img:JSON.parse(e.target.value).img})
            }
        ).then(res=>{if(res.redirected) location.href= res.url})
    }
}
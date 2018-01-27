$(function () {
  
    if(parseFloat(money) != 0){
	sessionStorage.setItem('isPaid', 0);
	sessionStorage.removeItem('paid_data');
    }

    isPaid = parseInt(sessionStorage.getItem('isPaid'));
    order_data = sessionStorage.getObject('paid_data');

    switch (isPaid){
        case 1:
            if(order_data != null){
                document.title = order_data['title'];
                // check payment status
                alert(order_data);
                sessionStorage.setItem('isPaid', 1);
                onPay();
            }
            break;
        case 2:
    	    alert('cancelled');
            sessionStorage.setItem('isPaid', 0);
            sessionStorage.removeObject('paid_data');
            break;
        default:
            sessionStorage.setItem('isPaid', 0);
            order_data = {
                'id' : orderid,
                'title' : title,
                'product' : product,
                'money' : money,
            };
    }
});

function onPay() {

    $.ajax({
        url: "wxpay_wap.php",
        type: "post",
        data: {
            'orderID': order_data['id'],
            'title': order_data['product'],
            'money': order_data['money']
        },
        success: function (res) {
            console.log(res);
            var redirect_url = window.location.href;
            alert(redirect_url);
          var result = JSON.parse(res);
            var status = result['status'];
            var err_code =result['data']; 
            var pay_url = result['url'];
	    
	    alert(JSON.stringify(result['response']));
	    
	    sessionStorage.removeItem('paid_data');
            switch (status){
                case 'SUCCESS' :
            	    if(isPaid == 1){
            		alert('cancelled');
            		sessionStorage.setItem('isPaid', 0);
            	    }else{
                        sessionStorage.setItem('isPaid', 1);
                        sessionStorage.setObject('paid_data', order_data);
                        
                        location.href = pay_url + '&redirect_url=' + encodeURIComponent(redirect_url);
                    }
                    break;
                case 'FAIL' :
            	    sessionStorage.setItem('isPaid',0); 
            	    switch(err_code){
            	    case 'ORDERPAID':
            	        alert('支付成功。');
            		sessionStorage.setItem('isPaid', 0);
            		sessionStorage.removeItem('paid_data');
            	        console.log(err_code);
            		break;
            	    case 'INVALID_REQUEST':
            		alert('order number wrong');
            	        break;
            	    default:
            	        alert(err_code);
		    }            	    
                    break;
            }

        },
        fail: function (result) {
            alert(result);
        }
    });
}


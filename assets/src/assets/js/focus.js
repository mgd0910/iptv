(function (window, document){

    var dateObj = null;
    var dateTimer = null;
    
    
    window.addEventListener("load",function(){
        window.focus();
        if(!dateObj){
            dateObj = new Control();
        }
    
        dateObj.updateTime();
        document.getElementById("nav_item1").focus(); 
    
        // FindFocus.FocusKeyEvent.focusBefore(leftFun,upFun,rightFun,downFun);
        
    })
    
    //需在该方法的执行完成后调用focus()获取焦点
    function leftFun(view){
        console.log("left");
        view.focus();
    
    }
    function rightFun(view){
        console.log("right");
        view.focus();
    
    }
    function upFun(view){
        console.log("up");
        view.focus();
    
    }
    function downFun(view){
        console.log("down");
        view.focus();
    }
    
    window.addEventListener("unload",function(){
    
        if(!dateTimer){
            clearInterval(dateTimer);
        }
    })
    
    
    window.addEventListener("keydown",function(){
        switch(event.keyCode){
            case 13://确认
                    alert("ok "+document.activeElement.id)
                break;
        }
    })
    
    
    })(window, document);
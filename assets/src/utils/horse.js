let time;
let horse = {
    horse(index, num) {

        console.log(num)
        var parents = document.getElementsByClassName('item_list')[num]
        
        var moves = parents.getElementsByClassName('move')
        var movesParent = parents.getElementsByClassName('title')[index]


        if (moves) {
           
            time = setInterval(function () {
                moves[index].style.left = parseInt(moves[index].offsetLeft) - 3 + 'px'
            //   
                if (Math.abs(parseInt(moves[index].offsetLeft)) > (movesParent.offsetWidth)) {
                    moves[index].style.left = movesParent.offsetWidth + 'px'
                }
            }, 200);



        }

    },
    bottom_horse(index, num) {

        console.log(num)
        var parents = document.getElementsByClassName('item_list_bottom')[num]
        
        var moves = parents.getElementsByClassName('move')
        var movesParent = parents.getElementsByClassName('title')[index]


        if (moves) {
           
            time = setInterval(function () {
                moves[index].style.left = parseInt(moves[index].offsetLeft) - 3 + 'px'
            //   
                if (Math.abs(parseInt(moves[index].offsetLeft)) > (movesParent.offsetWidth)) {
                    moves[index].style.left = movesParent.offsetWidth + 'px'
                }
            }, 200);



        }

    },
    horseKeshi(index, num) {

        var parents = document.getElementsByClassName('item_keshilist')[num]
        console.log(parents)
        var moves = parents.getElementsByClassName('move')
        var movesParent = parents.getElementsByClassName('title')[index]
        // var movesParent = parents.getElementsByTagName('title')[index]

        if (moves) {
            time = setInterval(function () {
                moves[index].style.left = parseInt(moves[index].offsetLeft) - 3 + 'px'
                // console.log(Math.abs(parseInt(moves[index].offsetLeft)))
                // console.log(movesParent.offsetWidth)
                if (Math.abs(parseInt(moves[index].offsetLeft)) > (movesParent.offsetWidth)) {
                    moves[index].style.left = movesParent.offsetWidth + 'px'
                }
            }, 200)



        }

    },
    blurKeshiHorse(index, num) {
        var parents = document.getElementsByClassName('item_keshilist')[num]
        var moves = parents.getElementsByClassName('move')
        var movesParent = document.getElementsByClassName('title')[0]
        if (moves) {
            clearInterval(time)
            setTimeout(function () {
                moves[index].style.left = 0
            }, 300)

        }
    },
    blurHorse(index, num) {
        var parents = document.getElementsByClassName('item_list')[num]
        var moves = parents.getElementsByClassName('move')
        var movesParent = document.getElementsByClassName('title')[0]
        if (moves) {
            clearInterval(time)
            console.log(moves)
            setTimeout(function () {
                moves[index].style.left = 0
            }, 300)


        }
    },
    bottom_horse_stop(index, num){
        var parents = document.getElementsByClassName('item_list_bottom')[num]
        var moves = parents.getElementsByClassName('move')
        var movesParent = document.getElementsByClassName('title')[0]
        if (moves) {
            clearInterval(time)
            console.log(moves)
            setTimeout(function () {
                moves[index].style.left = 0
            }, 300)


        }
    }
}
export default horse
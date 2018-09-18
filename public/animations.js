//------- start page animations--------
// $(".b1").on('mouseenter',function(){
//          
// }).on('mouseleave',function(){
//     $(this).removeClass('shakeMe')
// })   NOT WORKING PROPERLY
$('.b1').on('click', function () {
    $(this).addClass('animateY')
    setTimeout(() => {
        $('.signup a').addClass('animateX')
    }, 500)
    setTimeout(() => {
        $('.signup a').removeClass('animateX').addClass('animateXback')
        $('.b1').removeClass('animateY').addClass('animateYback')
    }, 2200)
    $('.signup a').removeClass('animateXback')
    $('.b1').removeClass('animateYback')
})

$(".b2").on('click', function () {
    $(this).addClass('animateY')
    setTimeout(() => {
        $('.login a').addClass('animateX')
    }, 500)
    setTimeout(() => {
        $('.login a').removeClass('animateX').addClass('animateXback')
        $('.b2').removeClass('animateY').addClass('animateYback')
    }, 2200)
    $('.login a').removeClass('animateXback')
    $('.b2').removeClass('animateYback')
})

$('.bt3').on('click', function () {
    $(this).addClass('animateBT1')
    setTimeout(() => {
        $('.startpageTitle').css({
            opacity: "1"
        })
    }, 200);
}).on('mouseleave', function () {
    $('.startpageTitle').css({
        opacity: "0"
    })
    $(this).removeClass('animateBT1', 1000)
})

$('#straw1').on('click', function () {
    $(this).removeClass('spinMe').addClass('spinMe')
    const id = setTimeout(() => {
        $(this).removeClass('spinMe').addClass('spinMeBack')
    }, 15000);
    $(this).removeClass('spinMeBack')
}).end('click').on('click', function(){
    clearTimeout(id)
    $(this).removeClass('spinMe').addClass('spinMeBack')
    $(this).removeClass('spinMeBack')
})


$('.s1').on('click', function () {
    $(this).removeClass('moveMe').addClass('moveMe') 
    setTimeout(() => {
        $('.startpageSubtitle').css({
            opacity: "1",
            transition : 'opacity 1s ease-in-out'
        })
    }, 800);
    const id = setTimeout(() => {
        $('.startpageSubtitle').css({
            opacity: "0",
            transition : 'opacity 1s ease-in-out'

        })
        $(this).removeClass('moveMe').addClass('moveMeBack')
    }, 15000);
    $(this).removeClass('moveMeBack')
}).end('click').on('click', function(){
    clearTimeout(id)
    $('.startpageSubtitle').css({
        opacity: "0",
        transition : 'opacity 1s ease-in-out'

    })
    $(this).addClass('moveMeBack')
    $(this).removeClass('moveMeBack')
})

// $('#straw1').on('mousenter', function () {
        
       
// }).end('click')

// $('.s1').on('mousenter', function () {
       
  
// }).end('click')

// $(document).ready(function(){
//     $('.notice').removeClass('showNotice').addClass('showNotice')
//     setTimeout(() => {
//         $('.notice').removeClass('showNotice')
//     }, 5000);
// })
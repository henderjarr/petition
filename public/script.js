

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const hiddenInput = document.getElementById('hiddenInput')

canvas.addEventListener('mousedown', function(e){
    ctx.beginPath()
    var mousex = e.offsetX
    var mousey = e.offsetY
    ctx.moveTo(mousex, mousey)
    canvas.addEventListener('mousemove', draw)
})
function draw(e) {
    var mousex = e.offsetX
    var mousey = e.offsetY
    ctx.lineTo(mousex, mousey)
    ctx.stroke()
}
canvas.addEventListener('mouseup', function(){
    canvas.removeEventListener('mousemove', draw)
    const dataURL = canvas.toDataURL()
    hiddenInput.value = dataURL
})






// ---------- event listeners -----------

// const buttonProfilePage = document.getElementById('buttonProfilePage')
// buttonProfilePage.addEventListener('click', function(){
//     console.log('ok')
// })















// canvas.addEventListener('mousedown', function (e) {
//     ctx.beginPath()
//     var mousex = e.clientX - this.offsetLeft
//     var mousey = e.clientY - this.offsetTop
//     ctx.moveTo(mousex, mousey)
//     canvas.addEventListener('mousemove', draw

// })

// function draw(e) {
//     var mousex = e.clientX - canvas.offsetLeft
//     var mousey = e.clientY - canvas.offsetTop
//     ctx.lineTo(mousex, mousey)
//     ctx.stroke()

// }
$('#rg').hide();
$('#lg').hide();
$('#head').hide();
$('#boutons').hide();
$('#btli').hide();
$('#lg').slideDown(500);
$('#head').slideDown(500);
$('#stats').slideDown(500);
$('#boutons').slideDown(500);


$(document).ready(function(){
  

  $('#dropdown').click(function(){
    $('#lg').slideUp(500);
    $('#dropdown').slideUp(500);
    $('#rg').delay(500).slideDown(500);
    $('#btli').delay(500).slideDown(500);
  });

  $('#lgbtn').click(function(){
    $('#head').slideUp(500);
    $('#lg').slideUp(500);
  })

  $('#btli').click(function(){
    $('#rg').slideUp(500);
    $('#btli').slideUp(500);
    $('#dropdown').delay(500).slideDown(500);
    $('#lg').delay(500).slideDown(500);
  })



});


// $('#mode').change(function(){
//   if ($(this).prop('checked')){
//     $('body').addClass('dark-mode');
//   } else {
//     $('body').removeClass('dark-mode');
//   }
// });
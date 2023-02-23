// fetches and prints how to say “Hello” depending on the language

$(document).ready(function () {
  const url = 'http://' + window.location.hostname + ':5001/api/v1/status/';
  $.get(url, function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  const amenities = {};
  $('input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('H4#sweet').text(Object.values(amenities).join(', '));
  });

  const request = 'http://0.0.0.0:5001/api/v1/places_search/';
  $.post(request,
  	{
      headers: 'Content-Type: application/json',
      data: {}
    },
    function (data, textStatus) {
      for (let i = 0; i < data.length; i++) {
        $('section.places').prepend('<article></article>').text('prepend() data[i]');
      }
    });
});

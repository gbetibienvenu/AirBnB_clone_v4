$(document).ready(function () {
  const placesUri = 'http://localhost:5001/api/v1/places_search/';
  const $placesSection = $('section.places');

  function createMaxGuests (guests) {
    if (guests !== 1) {
      return `<div class="max_guest">${guests} Guests</div>`;
    }

    return `<div class="max_guest">${guests} Guest</div>`;
  }

  function createRooms (rooms) {
    if (rooms !== 1) {
      return `<div class="number_rooms">${rooms} Bedrooms</div>`;
    }

    return `<div class="number_rooms">${rooms} Bedroom</div>`;
  }

  function createBathrooms (bathrooms) {
    if (bathrooms !== 1) {
      return `<div class="number_bathrooms">${bathrooms} Bathrooms</div>`;
    }

    return `<div class="number_bathrooms">${bathrooms} Bathroom</div>`;
  }

  function createArticleTitle (title, price) {
    return `<div class="title_box">
              <h2>${title}</h2>
              <div class="price_by_night">
                $${price}
              </div>
            </div>`;
  }

  function createArticleInfo (guests, rooms, bathrooms) {
    const maxGuests = createMaxGuests(guests);
    const maxRooms = createRooms(rooms);
    const maxBathrooms = createBathrooms(bathrooms);
    return `<div class="information">
              ${maxGuests}
              ${maxRooms}
              ${maxBathrooms}
            </div>`;
  }

  function createArticleDescription (description) {
    return `<div class="description">
              ${description}
            </div>`;
  }

  function createPlace (place) {
    const articleTitle = createArticleTitle(place.name, place.price_by_night);
    const articleInfo = createArticleInfo(place.max_guest, place.number_rooms, place.number_bathrooms);
    const articleDescription = createArticleDescription(place.description);
    return `<article>
              ${articleTitle}
              ${articleInfo}
              ${articleDescription}
            </article>`;
  }

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

  $.ajax({
    url: placesUri,
    type: 'POST',
    dataType: 'json',
    data: '{}',
    contentType: 'application/json',
    success: function (data) {
      for (let i = 0; i < data.length; ++i) {
        $placesSection.append(createPlace(data[i]));
      }
    }
  });
});

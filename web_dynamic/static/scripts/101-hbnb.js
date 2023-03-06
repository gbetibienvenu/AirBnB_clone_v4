// ------------------check status of api where data is got from-----------//

$(document).ready(function () {
  const url = 'http://' + window.location.hostname + ':5001/api/v1/status/';
  $.get(url, function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  // --------filter listing for states, cities and amenities-------------//

  const states = {};
  $('.locations > UL > H2 > INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;');
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  const cities = {};
  $('.locations > UL > UL > LI INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;');
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
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

  // ---------Get each place listing and insert into DOM-------------//
  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search/',
    type: 'POST',
    dataType: 'json',
    data: '{}',
    contentType: 'application/json',
    success: makeHTMLplaces
  });

  $('BUTTON').click(function () {
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({
        states: Object.keys(states),
        cities: Object.keys(cities),
        amenities: Object.keys(amenities)
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: makeHTMLplaces
    });
  });
});

function makeHTMLplaces (data) {
  $('SECTION.places').empty();
  $('SECTION.places').append(data.map(place => {
    return `<ARTICLE>
              <DIV class="title_box">
                <H2>${place.name}</H2>
                  <DIV class="price_by_night">
                    $${place.price_by_night}
                  </DIV>
                </DIV>
                <DIV class="information">
                  <DIV class="max_guest">
                    </BR>
                    ${place.max_guest} Guests
                  </DIV>
                  <DIV class="number_rooms">
                    </BR>
                    ${place.number_rooms} Bedrooms
                  </DIV>
                  <DIV class="number_bathrooms">
                    </BR>
                    ${place.number_bathrooms} Bathrooms
                  </DIV>
                </DIV>
                <DIV class="description">
                  ${place.description}
                </DIV>
              </ARTICLE>`;
  }));
}

// ------------------------get reviews------------------//

const monthOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'November',
  'December'
];

function numStNdRdTh (n) {
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

// ------------- Get all reviews associated with place ------------
const reviewsDiv = $(document.createElement('div'))
  .addClass('reviews');
const reviewsTitleH2 = $(document.createElement('h2'))

  .text('Reviews');

const reviewsButton = $(document.createElement('button'));

const reviewsButtonText = $(document.createElement('span'))

  .text('show');

reviewsButton.append(reviewsButtonText);

reviewsDiv.append(reviewsTitleH2);

reviewsDiv.append(reviewsButton);

$('section.places').append(reviewsDiv);

reviewsButton.click(function (e) {
  if (reviewsButtonText.text() === 'hide') { // Fetch reviews
    reviewsButtonText.text('show');

    reviewsTitleH2.text('Reviews');

    $(this).nextAll().remove();
  } else if (reviewsButtonText.text() === 'show') { // Hide reviews
    reviewsButtonText.text('hide');

    const reviewsListUl = $(document.createElement('ul'));

    $.ajax({

      url: `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`,

      type: 'GET',

      dataType: 'json'

    })

      .done(function (reviews) {
        const numberOfReviews = reviews.length;

        reviewsTitleH2.text(`${numberOfReviews} ${numberOfReviews === 1 ? 'Review' : 'Reviews'}`);

        reviews.forEach(function (review) {
        // --------- Get name of user that wrote current review -------

          const userId = review.user_id;

          $.ajax({

            url: `http://0.0.0.0:5001/api/v1/users/${userId}`,

            type: 'GET',

            dataType: 'json'

          })

            .done(function (user) {
              const updatedAt = new Date(review.updated_at);

              const date = updatedAt.getDate() +

  numStNdRdTh(updatedAt.getDay());

              const month = monthOfYear[updatedAt.getMonth()];

              const year = updatedAt.getFullYear();

              const fullDate = `${date} ${month} ${year}`;

              const reviewLi = $(document.createElement('li'));

              const reviewH3 = $(document.createElement('h3'))

                .text(`By ${user.first_name} ${user.last_name} on ${fullDate}`);

              const reviewP = $(document.createElement('p'))

                .html(review.text);

              reviewLi.append(reviewH3);

              reviewLi.append(reviewP);

              reviewsListUl.append(reviewLi);
            });
        });

        reviewsDiv.append(reviewsListUl);
      });
  }
});

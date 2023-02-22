// fetches and prints how to say “Hello” depending on the language

$(document).ready(function () {
  $('input').click(function () {
    const amenity_ids = [];
	const amenity_names = [];
	if(checkbox.is(':checked')) {
		amenity_ids.append(data-id);
		amenity_names.append(data-name);
		$(h4#sweet).append(amenity_names);
	} else {
		amenity_ids.pop(data-id)
	}
    $.get(url, { lang: langCode }, function (data) {
      $('#hello').text(data.hello);
    });
  });
});

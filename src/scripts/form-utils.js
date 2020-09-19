window.formSubmit = (response) => {
  const $form = $('#contact-form');
  $form.find('.g-recaptcha-response').val(response);

  const data = $form.serialize();
  $.post($form.attr('action'), data, 'json')
    .done(() => {
      $.fancybox.open($('#form-success-message'));
      $form.find('input, textarea').val('');
      console.log('Form was sent. Success!', { data });
    })
    .fail((jqXhr, status, error) => {
      $.fancybox.open($('#form-error-message'));
      console.log("Form wasn't sent", status, error, { data });
    });
};

document.addEventListener('DOMContentLoaded', () => {
  const $form = $('#contact-form');
  $form.on('submit', (e) => {
    e.preventDefault();
    const { grecaptcha } = window;
    if (grecaptcha) {
      e.preventDefault();
      grecaptcha.reset();
      grecaptcha.execute();
    }
  });
});

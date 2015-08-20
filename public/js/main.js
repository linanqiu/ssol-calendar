(function ($) {
  "use strict";

  // Options for Message
  //----------------------------------------------
  var options = {
    'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
    'btn-success': '<i class="fa fa-check"></i>',
    'btn-error': '<i class="fa fa-remove"></i>',
    'msg-success': 'Downloading calendar files',
    'msg-error': 'Wrong login credentials',
    'msg-building': 'X_NUM classes found. Creating calendar files'
  };
  // Login Form
  //----------------------------------------------
  // Validation
  $("#login-form").validate({
    rules: {
      lg_username: "required",
      lg_password: "required",
    },
    errorClass: "form-invalid"
  });

  // Form Submission
  $("#login-form").submit(function () {
    remove_loading($(this));

    submitForm($(this));

    // Cancel the normal submission.
    // If you don't want to use AJAX, remove this
    return false;

  });

  // Loading
  //----------------------------------------------
  function remove_loading($form) {
    $form.find('[type=submit]').removeClass('error success');
    $form.find('.login-form-main-message').removeClass('show error success').html('');
  }

  function form_loading($form) {
    $form.find('[type=submit]').addClass('clicked').html(options['btn-loading']);
  }

  function form_success($form) {
    $form.find('[type=submit]').addClass('success').html(options['btn-success']);
    $form.find('.login-form-main-message').addClass('show success').html(options['msg-success']);
  }

  function form_building($form) {
    $form.find('[type=submit]').addClass('clicked').html(options['btn-loading']);
    $form.find('.login-form-main-message').addClass('show success').html(options['msg-building']);
  }

  function form_failed($form) {
    $form.find('[type=submit]').addClass('error').html(options['btn-error']);
    $form.find('.login-form-main-message').addClass('show error').html(options['msg-error']);
  }

  function submitForm($form) {
    if ($form.valid()) {
      form_loading($form);

      $.post('/', $form.serialize(), function (data) {
        if (data.length == 0) {
          form_failed($form);
        } else {
          options['msg-building'] = options['msg-building'].replace('X_NUM', data.length);
          form_building($form);
          console.log(data);
          createCalendarFile(data, $form);
        }
      });
    }
  }

  function createCalendarFile(data, $form) {
    var cal = ics();
    data.forEach(function (classData) {

      if (classData.day.join().length > 0 && classData.time != null && classData.startDate != null && classData.endDate != null) {
        var subject = classData.dept + ' ' + classData.courseCode + ' ' + classData.fullName;
        var description = classData.instructorName + ' <' + classData.instructorEmail + '>';
        var location = classData.room + ' ' + classData.building;
        var pattern = /(\d{2})\/(\d{2})\/(\d{2})/;

        var startTime = classData.time.split('-')[0];
        var endTime = classData.time.split('-')[1];

        var start = Date.parse(classData.startDate.replace(pattern, '20$3-$1-$2') + ' ' + startTime);
        var end = Date.parse(classData.startDate.replace(pattern, '20$3-$1-$2') + ' ' + endTime);
        var ex = new Date(classData.endDate.replace(pattern, '20$3-$1-$2'));

        cal.addEvent(subject, description, location, start, end, classData.day, ex);
      }
    });

    cal.download('ssol-schedule-' + Date.today().toLocaleDateString());

    form_success($form);
  }

})(jQuery);

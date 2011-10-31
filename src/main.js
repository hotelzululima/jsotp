// OTP code. Copyright (c) 2003-2004, Jeremy Lin.
// See <http://www.ocf.berkeley.edu/~jjlin/jsotp/about.html> for details.

FORMAT = a_to_both; // default; others can be selected via onClick handler
JSOTP_PW_WINDOW = null;
function with_hash(alg) {
  var challenge = document.otp_form.challenge.value.split(/\s+/);
  var iter = parseInt(challenge[0], 10);
  var secret = document.otp_form.secret.value;
  var num_pw = parseInt(document.otp_form.num_pw.value);
  var ans_box = document.otp_form.answer;
  if (challenge.length != 2 || isNaN(iter)) {
    ans_box.value = "Challenge not in form of <number> <string>.";
    return;
  } else if (isNaN(num_pw) || num_pw < 1) {
    ans_box.value = "Number of passwords requested must be at least 1.";
    return;
  } else if (num_pw > iter + 1) {
    ans_box.value = "At most " + (iter+1) + " passwords can be computed " +
                    "from that input.";
    return;
  }
  var one = (num_pw == 1);
  var gen_otp;
  switch (alg) {
  case 'MD4': gen_otp = one ? gen_otp_md4 : gen_otp_mult_md4; break;
  case 'MD5': gen_otp = one ? gen_otp_md5 : gen_otp_mult_md5; break;
  case 'SHA1': gen_otp = one ? gen_otp_sha1 : gen_otp_mult_sha1; break;
  case 'RMD160': gen_otp = one ? gen_otp_rmd160 : gen_otp_mult_rmd160; break;
  }
  if (one) {
    ans_box.value = "Computing...";
    var pw = gen_otp(secret, challenge[1], iter);
    ans_box.value = FORMAT(pw);
  } else {
    ans_box.value = "Computing...    (Passwords will appear in a new window.)";
    var pwa = gen_otp(secret, challenge[1], iter, num_pw);
    JSOTP_PW_WINDOW = window.open("", "jsotp_pw_window","");
    JSOTP_PW_WINDOW.document.open();
    JSOTP_PW_WINDOW.document.writeln("<HTML><BODY><PRE>");
    var base = iter - num_pw + 1;
    for (var i = 0; i < pwa.length; ++i)
      JSOTP_PW_WINDOW.document.writeln((base + i) + ": " + FORMAT(pwa[i]));
    JSOTP_PW_WINDOW.document.writeln("</PRE></BODY></HTML>");
    JSOTP_PW_WINDOW.document.close();
    ans_box.value = "Done."
  }
}

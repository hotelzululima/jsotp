function gen_otp_md4(secret, seed, n) {
    var t = seed.toString().toLowerCase() + secret;
    t = mdx_fold(core_md4(str2binl(t), t.length * 8));
    for (var i = n; i > 0; --i) { t = mdx_fold(core_md4(t, 64)); }
    return t;
}

function gen_otp_md5(secret, seed, n) {
    var t = seed.toString().toLowerCase() + secret;
    t = mdx_fold(core_md5(str2binl(t), t.length * 8));
    for (var i = n; i > 0; --i) { t = mdx_fold(core_md5(t, 64)); }
    return t;
}

function gen_otp_sha1(secret, seed, n) {
    var t = seed.toString().toLowerCase() + secret;
    t = sha1_fold(core_sha1(str2binb(t), t.length * 8));
    for (var i = n; i > 0; --i) { t = sha1_fold(core_sha1(t, 64)); }
    t = invert_endian(t, true);
    return t;
}

function gen_otp_rmd160(secret, seed, n) {
    var t = seed.toString().toLowerCase() + secret;
    t = rmd160_fold(core_rmd160(str2binl(t), t.length * 8));
    for (var i = n; i > 0; --i) { t = rmd160_fold(core_rmd160(t, 64)); }
    return t;
}

function gen_otp_mult_md4(secret, seed, n, m) {
    var res = Array(); var lim = n - m + 1;
    var t = seed.toString().toLowerCase() + secret;
    t = mdx_fold(core_md4(str2binl(t), t.length * 8));
    if (lim == 0) res[0] = t;
    for (var i = 1; i <= n; ++i) {
	t = mdx_fold(core_md4(t, 64));
	if (i >= lim) res[i-lim] = t;
    }
    return res;
}

function gen_otp_mult_md5(secret, seed, n, m) {
    var res = Array(); var lim = n - m + 1;
    var t = seed.toString().toLowerCase() + secret;
    t = mdx_fold(core_md5(str2binl(t), t.length * 8));
    if (lim == 0) res[0] = t;
    for (var i = 1; i <= n; ++i) {
	t = mdx_fold(core_md5(t, 64));
	if (i >= lim) res[i-lim] = t;
    }
    return res;
}

function gen_otp_mult_sha1(secret, seed, n, m) {
    var res = Array(); var lim = n - m + 1;
    var t = seed.toString().toLowerCase() + secret;
    t = sha1_fold(core_sha1(str2binb(t), t.length * 8));
    if (lim == 0) res[0] = invert_endian(t, false);
    for (var i = 1; i <= n; ++i) {
	t = sha1_fold(core_sha1(t, 64));
	if (i >= lim) res[i-lim] = invert_endian(t, false);
    }
    return res;
}

function gen_otp_mult_rmd160(secret, seed, n, m) {
    var res = Array(); var lim = n - m + 1;
    var t = seed.toString().toLowerCase() + secret;
    t = rmd160_fold(core_rmd160(str2binl(t), t.length * 8));
    if (lim == 0) res[0] = t;
    for (var i = 1; i <= n; ++i) {
	t = rmd160_fold(core_rmd160(t, 64));
	if (i >= lim) res[i-lim] = t;
    }
    return res;
}

function mdx_fold(h) { return Array(h[0] ^ h[2], h[1] ^ h[3]); }

function sha1_fold(h) {
    h = invert_endian(h, true);
    return Array(h[0] ^ h[2] ^ h[4], h[1] ^ h[3]);
}

function rmd160_fold(h) { return Array(h[0] ^ h[2] ^ h[4], h[1] ^ h[3]); }

function invert_endian(a, inpl) {
    var t = inpl ? a : Array(a.length);
    for (var i = 0; i < a.length; ++i) {
	var t1 = (a[i] & 0xff) << 24;
	var t2 = ((a[i] >> 8) & 0xff) << 16;
	var t3 = ((a[i] >> 16) & 0xff) << 8;
	var t4 = (a[i] >> 24) & 0xff;
	t[i] = t1 | t2 | t3 | t4;
    }
    return t;
}

function a_to_both(a) { return a_to_6word(a) + " (" + a_to_hex(a) + ")"; }

function a_to_hex(a) {
    var s = "";
    for (var i = 0; i < 2; ++i) {
	for (var j = 0; j < 4; ++j) {
	    var t = (a[i] >> (8*j)) & 0xff;
	    t = t.toString(16).toUpperCase();
	    s += (t.length == 1) ? ('0' + t) : t; // 1 octet = 2 hex digits
	    if (j % 2 == 1) s += ' ';
	}
    }
    return s.substr(0, s.length-1); // drop the last space
}

function a_to_6word(h) {
    var s = "";
    var parity = 0;
    for (var i = 0; i < 2; ++i) {
	for (var j = 0; j < 32; j += 2) {
	    parity += (h[i] >> j) & 0x3;
	}
    }
    var ind;
    ind = (h[0] & 0xff) << 3;
    ind |= (h[0] >> 13) & 0x7;
    s += WORDS[ind] + " ";
    ind = ((h[0] >> 8) & 0x1f) << 6;
    ind |= (h[0] >> 18) & 0x3f;
    s += WORDS[ind] + " ";
    ind = ((h[0] >> 16) & 0x3) << 9;
    ind |= ((h[0] >> 24) & 0xff) << 1;
    ind |= (h[1] >> 7) & 0x1;
    s += WORDS[ind] + " ";
    ind = (h[1] & 0x7f) << 4;
    ind |= (h[1] >> 12) & 0xf;
    s += WORDS[ind] + " ";
    ind = ((h[1] >> 8) & 0xf) << 7;
    ind |= (h[1] >> 17) & 0x7f;
    s += WORDS[ind] + " ";
    ind = ((h[1] >> 16) & 0x1) << 10;
    ind |= ((h[1] >> 24) & 0xff) << 2;
    ind |= (parity & 0x03);
    s += WORDS[ind];
    return s;
}

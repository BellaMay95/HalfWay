var records = [
    { id: 1, username: 'jack', password: '$argon2i$v=19$m=4096,t=3,p=1$LPssW146bXCO8pOaAKT/zg$M1tYJCrIt0ib3QdMV95p/quJZJcMF5Hu84zeTt5MANc', displayName: 'Jack', email: 'jack@example.com' }, //pw: secret
    { id: 2, username: 'jill', password: '$argon2i$v=19$m=4096,t=3,p=1$JsettKvFadXJNCOoDfgvMg$jaRbsIgOg16wHVHIJmlp9qnKvFeoDH2kcWTWG/76B70', displayName: 'Jill', email: 'jill@example.com' }, //pw: birthday
    { id: 3, username: 'jane', password: '$argon2i$v=19$m=4096,t=3,p=1$8GKe0TZpvyHWT0XAtEYg4g$MdEQoyyax0EQpGI8iUqbaqP62E51rJT9d5HGpu/tJm4', displayName: 'Jane', email: 'halfway@google.com' } //pw: password
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'), null);
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}

exports.findByEmail = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.email === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
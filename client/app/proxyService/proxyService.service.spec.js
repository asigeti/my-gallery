'use strict';

describe('Service: proxyService', function () {

  // load the service's module
  beforeEach(module('photoGalleryApp'));

  // instantiate service
  var proxyService;
  beforeEach(inject(function (_proxyService_) {
    proxyService = _proxyService_;
  }));

  it('should do something', function () {
    expect(!!proxyService).toBe(true);
  });

});

(function ($, QUnit) {

    QUnit.test("defaults", function (assert) {
        assert.ok($.fn.uploader.defaults, "defaults exist");
        assert.equal($.fn.uploader.defaults.theme, "default", "defaults are set");
        $.fn.uploader.defaults.theme = "test";
        assert.equal($.fn.uploader.defaults.theme, "test", "can change the defaults globally");
    });

    QUnit.test("user options", function (assert) {
        $(':input[type="file"]').uploader({
            'showThumbs': true,
            'addMore': true,
            'allowDuplicates': true
        });
        
        var uploader = $(':input[type="file"]').prop('uploader');
        assert.equal(uploader.options.showThumbs, true, "showThumbs is set");
        assert.equal(uploader.options.addMore, true, "addMore is set");
        assert.equal(uploader.options.allowDuplicates, true, "allowDuplicates is set");
    });

}(jQuery, QUnit));

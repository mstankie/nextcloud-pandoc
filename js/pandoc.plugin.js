(function() {

  OCA.Pandoc = OCA.Pandoc || {};

  /**
   * @namespace
   */
  OCA.Pandoc.Util = {

    /**
     * Initialize the Pandoc plugin.
     *
     * @param {OCA.Files.FileList} fileList file list to be extended
     */
    attach: function(fileList) {

      if (fileList.id === 'trashbin' || fileList.id === 'files.public') {
        return;
      }

      fileList.registerTabView(new OCA.Pandoc.PandocTabView('pandocTabView', {}));

    }
  };
})();

OC.Plugins.register('OCA.Files.FileList', OCA.Pandoc.Util);

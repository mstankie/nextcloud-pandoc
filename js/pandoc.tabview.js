(function() {

  var PandocTabView = OCA.Files.DetailTabView.extend({

    id: 'pandocTabView',
    className: 'tab pandocTabView',

    /**
     * get label of tab
     */
    getLabel: function() {

      return t('pandoc', 'Pandoc');

    },

    /**
     * Renders this details view
     *
     * @abstract
     */
    render: function() {
      this._renderSelectList(this.$el);

      this.delegateEvents({
        'change #choose-algorithm': '_onChangeEvent'
      });

    },

    _renderSelectList: function($el) {
      $el.html('<div class="get-pandoc">'
        + '<select id="choose-algorithm">'
          + '<option value="">' + t('pandoc', 'Choose destination file format') + '</option>'
          + '<option value="pdf">Portable document (PDF)</option>'
          + '<option value="docx">MS Word (DOCX)</option>'
          + '<option value="odt">Open document (ODT)</option>'
          + '<option value="md">Markdown (MD)</option>'
          + '<option value="txt">Plain text file (TXT)</option>'
          + '<option value="epub">Electronic publication (EPUB)</option>'
          + '<option value="html">HyperText Markup Language (HTML)</option>'
          + '<option value="tex">LaTeX (TEX)</option>'
        + '</select></div>'
      );
    },

    /**
     * show tab only on files
     */
    canDisplay: function(fileInfo) {

      if(fileInfo != null) {
        if(!fileInfo.isDirectory()) {
          return true;
        }
      }
      return false;

    },

    /**
     * ajax callback for generating md5 hash
     */
    check: function(fileInfo, algorithmType) {
      // skip call if fileInfo is null
      if(null == fileInfo) {
        _self.updateDisplay({
          response: 'error',
          msg: t('pandoc', 'No fileinfo provided.')
        });

        return;
      }

      var url = OC.generateUrl('/apps/pandoc/check'),
          data = {source: fileInfo.getFullPath(), type: algorithmType},
          _self = this;
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        data: data,
        async: true,
        success: function(data) {
          _self.updateDisplay(data, algorithmType);
        }
      });

    },

    /**
     * display message from ajax callback
     */
    updateDisplay: function(data, algorithmType) {

      var msg = '';
      if('success' == data.response) {
        msg = data.msg;
      }
      if('error' == data.response) {
        msg = data.msg; //TODO: mark in red
      }

      msg += '<br><br><a id="reload-pandoc" class="icon icon-history" style="display:block" href=""></a>';

      this.delegateEvents({
        'click #reload-pandoc': '_onReloadEvent'
      });

      this.$el.find('.get-pandoc').html(msg);

    },

    /**
     * changeHandler
     */
    _onChangeEvent: function(ev) {
      var algorithmType = $(ev.currentTarget).val();
      if(algorithmType != '') {
        this.$el.html('<div style="text-align:center; word-wrap:break-word;" class="get-pandoc"><p><img src="'
          + OC.imagePath('core','loading.gif')
          + '"><br><br></p><p>'
          + t('pandoc', 'Generating file ...')
          + '</p></div>');
        this.check(this.getFileInfo(), algorithmType);
      }
    },

    _onReloadEvent: function(ev) {
      ev.preventDefault();
      this._renderSelectList(this.$el);
      this.delegateEvents({
        'change #choose-algorithm': '_onChangeEvent'
      });
    }

  });

  OCA.Pandoc = OCA.Pandoc || {};

  OCA.Pandoc.PandocTabView = PandocTabView;

})();

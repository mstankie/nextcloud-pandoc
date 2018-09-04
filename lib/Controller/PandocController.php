<?php
namespace OCA\Pandoc\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;
use OC\Files\Filesystem;
use OCP\AppFramework\Http\JSONResponse;


class PandocController extends Controller {

		protected $language;

		public function __construct($appName, IRequest $request, $UserId) {

				parent::__construct($appName, $request);

				// get i10n
				$this->language = \OC::$server->getL10N('pandoc');
				$this->userId = $UserId;

		}

		/**
		 * callback function convert file with Pandoc
		 * @NoAdminRequired
		 * @param (string) $source - filename
		 * @param (string) $type - output format
		 */
	  public function check($source, $type) {
	  		if(!$this->checkAlgorithmType($type)) {
	  			return new JSONResponse(
							array(
									'response' => 'error',
									'msg' => $this->language->t('The output format "%s" is not supported.', array($type))
							)
					);
	  		}

				if($error = $this->getHash($source, $type)){
					// Expecting empty output; if not empty -error message
						return new JSONResponse(
								array(
										'response' => 'error',
										'msg' => $error,
										'src' => Filesystem::getLocalFile($source)
								)
						);
				} else {
						return new JSONResponse(
								array(
										'response' => 'success',
										'msg' => "File created: " . $source . "." . $type,
										'src' => Filesystem::getLocalFile($source)
								)
						);
				};

	  }

	  protected function getHash($source, $type) {

	  	if($info = Filesystem::getLocalFile($source)) {
				$sourceExt = pathinfo($source)['extension'];
				$user = $this->userId;
				$dirname = '/' . $user . '/files'.dirname($source);
				$wd = dirname($info);
				$previousWorkingDirectory = getcwd();

				if($sourceExt == "tex" && $type == "pdf") {
					$pandocCmd = "PATH=/usr/bin: latexmk -pdf " . $info . " && latexmk -c";
				}
				else {
					//FOR MODERN PANDOC ONLY (>2.1) $pandocCmd = "pandoc --resource-path=" . $wd . " -o " . $info . "." . $type . " " . $info . " 2>&1";
					$pandocCmd = "PATH=/usr/bin: pandoc -o '" . $info . "." . $type . "' '" . $info . "' 2>&1";
//return $root."|".$dirname."|".$wd."|".$info."|".$source."|".getcwd();
				}
				// Set working directory to the directory of source file
				chdir($wd);
				$ret = shell_exec($pandocCmd); //may be replaced with single command without changing pwd for newer pandoc
				// Go back to where nc was before we changed the working directory
				chdir($previousWorkingDirectory);
				// Force nc to chack the new files
				$scanNewFIlesCmd = "php occ files:scan --quiet --path '" . $dirname . "'";
				shell_exec($scanNewFIlesCmd);
				return $ret;
	  	}

	  	return $this->language->t('File not found.');
	  }

	  protected function checkAlgorithmType($type) {
	  	return in_array($type, $this->getAllowedAlgorithmTypes());
	  }

	  protected function getAllowedAlgorithmTypes() {
	  	return array(
				'docx',
				'md',
				'odt',
				'pdf',
				'txt',
				'html',
				'tex',
				'epub'
			);
		}
}


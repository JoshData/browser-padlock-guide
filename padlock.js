// Turn each selected element into a padlock.
jQuery.fn.extend({
	padlock: function(options) {
		function detect_browser() {
			if (bowser.chrome)
				return "chrome35";
			if (bowser.firefox && parseInt(bowser.version) >= 14)
				return "firefox32";
			if (bowser.firefox) // actually only valid >= 8
				return "firefox8";
			return "unknown";
			//alert(parseInt(bowser.version))
		}

		function make_padlock(elem) {
			// get options

			var browser = 
				   elem.attr("data-padlock-browser")
				|| (options && options.browser)
				|| detect_browser();

			var domain = 
				   elem.attr("data-padlock-domain")
				|| (options && options.domain)
				|| window.location.hostname
				|| "www.example.org";

			var path = 
				   elem.attr("data-padlock-path")
				|| (options && options.path)
				|| (window.location.hostname && window.location.pathname)
				|| "/file.html";

			var evIdentity = 
				   elem.attr("data-padlock-ev-identity")
				|| (options && options.evIdentity)
				|| null;

			// set div template

			elem.html(
				  "<div class='padlock-example'>"
				+ "  <div class='padlock-box'>"
			    + "    <div class='padlock-icon-container'>"
			    + "      <div class='padlock-icon'></div>"
			    + "      <div class='padlock-icon-identity'></div>"
			    + "    </div>"
			    + "    <div class='padlock-url'>"
			    + "      <span class='padlock-url-scheme'> </span>"
			    + "<span class='padlock-url-colonslashslash'> </span>"
			    + "<span class='padlock-url-domain'> </span>"
			    + "<span class='padlock-url-path'> </span>"
			    + "    </div>"
			    + "    <div style='clear: both'></div>"
			    + "  </div>"
				+ "  <div class='padlock-instructions'>"
			    + "  </div>"
			    + "</div>"
			    )

			// set static text

			elem.find('.padlock-url-scheme').text('https')
			elem.find('.padlock-url-colonslashslash').text('://')
			elem.find('.padlock-url-domain').text(domain)
			elem.find('.padlock-url-path').text(path)

			// set classes

			elem.find('.padlock-box').addClass('padlock-browser-' + browser)
			if (evIdentity) {
				if (browser == "firefox32" || browser == "firefox8") {
					// Expect the country code in brackets at the end, but for Firefox
					// display it with parens.
					evIdentity = evIdentity.replace(/\[(..)\]$/, "($1)")
				}

				elem.find('.padlock-box').addClass('padlock-cert-ev')
				elem.find('.padlock-icon-identity').text(evIdentity)
			} else {
				elem.find('.padlock-icon-identity').text(domain)
			}

			// instructions

			var inx;
			if (browser == "chrome35" && !evIdentity)
				inx = "Look for a green lock and “DOMAIN” in dark text.";
			else if (browser == "chrome35" && evIdentity)
				inx = "Look for a green lock, the company name, and “DOMAIN” in dark text.";
			else if (browser == "firefox32" && !evIdentity)
				inx = "Look for a lock and “DOMAIN” in dark text.";
			else if (browser == "firefox32" && evIdentity)
				inx = "Look for a green lock, the company name, and “DOMAIN” in dark text.";
			else if (browser == "firefox8" && !evIdentity)
				inx = "Look for “DOMAIN” in blue on the left and then again in dark text on the right.";
			else if (browser == "firefox8" && evIdentity)
				inx = "Look for the company name in green and “DOMAIN” in dark text.";
			else
				inx = "This example is approximate. Look for a lock icon and “DOMAIN.”"

			inx = inx.replace(/DOMAIN/, domain);

			elem.find('.padlock-instructions').text(inx)


		}

		return this.each(function() {
			make_padlock($(this));
		});
	}
})

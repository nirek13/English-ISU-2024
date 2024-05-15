// Smooth Scroll to same page href without modifying pathname
// https://css-tricks.com/snippets/jquery/smooth-scrolling/
$('a[href*="#"]')
	.not('[href="#"]')
	.not('[href="#0"]')
	.click(function (event) {
		if (
			location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
			&&
			location.hostname == this.hostname
		) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				event.preventDefault();
				$('html, body').animate({
					scrollTop: target.offset().top
				}, 0, function () {
					var $target = $(target);
					$target.focus();
					if ($target.is(":focus")) {
						return false;
					} else {
						$target.attr('tabindex', '-1');
						$target.focus();
					};
				});
			}
		}
	});

$('#profile-picture').click(function () {
	window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});

$('#codeblock-icon-email').click(function () {
	window.location.href = "mailto:anthony.tedja@mail.utoronto.ca";
});

$('#codeblock-icon-github').click(function () {
	window.location.href = "https://github.com/nirek13";
});

$('#codeblock-icon-linkedin').click(function () {
	window.location.href = "https://www.linkedin.com/in/nirek-shetty-a9a7322b5/";
});

$('#codeblock-icon-devpost').click(function () {
	window.location.href = "https://devpost.com/nirekshetty";
});

$('#codeblock-icon-unsplash').click(function () {
	window.location.href = "https://unsplash.com/@anthonytedja";
});

$('#codeblock-icon-instagram').click(function () {
	window.location.href = "";
});

// Initialize click count
let clickCount = 0;

// Get button and click count span elements
const likeButton = document.getElementById('likeButton');
const clickCountSpan = document.getElementById('likeCount');

// Add click event listener to the button
likeButton.addEventListener('click', () => {
	// Increment click count
	clickCount++;
	// Update the text content of the click count span
	clickCountSpan.textContent = clickCount.toString();
	console.log("clicked")

});

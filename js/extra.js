// Extra JavaScript for Blockchain Skeptic's Guide
// Adds copy button to prompt admonitions

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.admonition.prompt').forEach(function (admonition) {
    var title = admonition.querySelector('.admonition-title');
    if (!title) return;

    var btn = document.createElement('button');
    btn.className = 'copy-button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      // Get the text content of the admonition body (excluding the title)
      var body = admonition.querySelector('.admonition-title ~ *');
      if (body) {
        navigator.clipboard.writeText(body.textContent.trim()).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
        });
      }
    });
    title.appendChild(btn);
  });
});

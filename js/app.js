document.addEventListener("DOMContentLoaded", () => {
  //login
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const messageBox = document.getElementById("messageBox");
      function showMessage(msg, type = "error") {
        messageBox.textContent = msg;
        messageBox.className = `message-box ${type} show`;
      }

      const name = document.getElementById("name").value.trim();
      const roleInput = document.querySelector('input[name="role"]:checked');

      if (!name) {
        showMessage("Please enter your name!");
        return;
      }

      if (!roleInput) {
        showMessage("Please select a role!");
        return;
      }

      const role = roleInput.value;

      const submitButton = event.target.querySelector('button[type="submit"]');
      submitButton.innerHTML = '<span class = "spinner"></span> Loading...';
      submitButton.disabled = true;

      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", role);

      //sheets
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxL-cAaUs2qra_Of4VOLCgfuaPTKZB_LSOWEMBdK1bkOY9mPmig4188L_OyOQyJy0_0YA/exec";

      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);

      fetch(scriptURL, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          window.location.href = "portfolio.html";
        })

        .catch((error) => {
          console.error("Error:", error);
          window.location.href = "portfolio.html";
        });
    });
  }

  //typing

  const subtitle = document.querySelector("main h1");
  const storedName = localStorage.getItem("userName");
  const storedRole = localStorage.getItem("userRole");

  if (subtitle && storedName && storedRole) {
    const originalText = subtitle.textContent;

    function typeText(text, callback) {
      subtitle.textContent = "";
      let i = 0;
      const typing = setInterval(() => {
        subtitle.textContent += text.charAt(i);
        i++;
        if (i === text.length) {
          clearInterval(typing);
          if (callback) callback();
        }
      }, 80);
    }

    function eraseText(callback) {
      let text = subtitle.textContent;
      const erasing = setInterval(() => {
        text = text.slice(0, -1);
        subtitle.textContent = text;
        if (text.length === 0) {
          clearInterval(erasing);
          if (callback) callback();
        }
      }, 40);
    }

    if (storedRole === "teacher") {
      typeText(`Hello, Professor ${storedName}!`, () => {
        setTimeout(() => {
          eraseText(() => {
            typeText(originalText);
          });
        }, 2500);
      });
    } else {
      typeText(`Hello, ${storedName}!`, () => {
        setTimeout(() => {
          eraseText(() => {
            typeText(originalText);
          });
        }, 2500);
      });
    }
  }

  //aos
  window.addEventListener("load", () => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 200,
    });

    setTimeout(() => {
      AOS.refresh();
    }, 500);
  });
});

$(() => {
  let int = setInterval(() => {
    if ($(".tp-library__header-search-wrapper").length) {
      clearInterval(int);

      $(".tp-library__header-search-wrapper").after(
        '<p class="autosearch" title="Включить автопереход к поиску">авто</p>'
      );

      let $searchButton = $(".tp-library__header-search-wrapper"),
        $onoff = $(".autosearch");

      if (+localStorage.getItem("autosearch")) $onoff.addClass("on");

      $onoff.on("click", function () {
        if (!$(this).hasClass("on")) {
          localStorage.setItem("autosearch", 1);
          $(this).addClass("on");
          $searchButton.trigger("click");
        } else {
          localStorage.setItem("autosearch", 0);
          $(this).removeClass("on");
        }
      });

      $(document).on("click", ".insertafterrecorbutton", () => {
        setTimeout(() => {
          if (+localStorage.getItem("autosearch")) {
            $searchButton.trigger("click");
          }
        }, 100);
      });
    }
  }, 500);
});

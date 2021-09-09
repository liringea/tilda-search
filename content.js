function num_word(value, words) {
  value = Math.abs(value) % 100;
  var num = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num == 1) return words[0];
  return words[2];
}

$.getScript({
  url: "https://w.uptolike.com/widgets/v1/zp.js?pid=1946910",
  cache: true,
});

$(document).on("click", ".name-project", (e) => {
  e.preventDefault();
  window.open($(e.currentTarget).attr("href"));
});

$(() => {
  let int = setInterval(() => {
    let $menuAppend = $(".td-project-midpanel");
    if ($menuAppend.length) {
      clearInterval(int);

      $menuAppend.append(
        '<div class="search-page-block"><input type="text" placeholder="Поиск страниц и папок"><p></p><span>Искать</span><div class="search-window"><div class="search-panel"><div></div><a href="https://t.me/eduardliring" title="Сложное программирование и вёрстка для Tilda">Создано Лиринг Эдуардом</a></div></div></div>'
      );

      let $searchBlock = $menuAppend.children(".search-page-block"),
        $inputText = $searchBlock.children("input"),
        $warningText = $searchBlock.children("p"),
        $searchButton = $searchBlock.children("span"),
        $searchWindow = $searchBlock.children(".search-window"),
        $searchPanel = $searchWindow.children(".search-panel"),
        $contentPanel = $searchPanel.children("div"),
        load = false;

      function showSearchWindow() {
        if (load) return;
        if (!$searchWindow.hasClass("show")) {
          load = true;
          $searchButton.text("Ищу...");
          $warningText.text("");

          let query = $inputText.val().toLowerCase().trim();
          if (query.length < 3) {
            $warningText.text("Слишком короткий запрос");
            load = false;
            $searchButton.text("Искать");
            return false;
          }

          $contentPanel.empty();

          $.post(
            "https://tilda.cc/projects/get/getprojects/",
            { comm: "getprojectslist" },
            (e) => {
              let projObj = JSON.parse(e),
                html = "",
                sumCountS = 0,
                ch = projObj.projects.length,
                cw = false;

              for (const p of projObj.projects) {
                $.post(
                  "https://tilda.cc/projects/get/getprojects/",
                  { comm: "getprojectslist", projectid: p.id },
                  (e) => {
                    ch--;
                    let obj = JSON.parse(e),
                      qArr = query.split(" "),
                      pages = obj.pages,
                      pageArr = [],
                      folders = obj.folders,
                      folderArr = [],
                      urlSite = obj.project.url,
                      urlProject =
                        "https://tilda.cc/projects/?projectid=" + p.id,
                      nameProject = p.title;

                    for (const e of qArr) {
                      if (pages) {
                        for (const a of pages) {
                          if (
                            (urlSite + "/" + a.alias).toLowerCase().indexOf(e) >
                              -1 ||
                            a.title.toLowerCase().indexOf(e) > -1 ||
                            (urlSite + "/" + a.url).toLowerCase().indexOf(e) >
                              -1 ||
                            (
                              "https://tilda.cc/page/?pageid=" +
                              a.id +
                              "&projectid=" +
                              a.projectid
                            )
                              .toLowerCase()
                              .indexOf(e) > -1
                          ) {
                            pageArr.push(a);
                          }
                        }
                      }

                      if (folders) {
                        for (const a of folders) {
                          if (
                            a.title.toLowerCase().indexOf(e) > -1 ||
                            (
                              "https://tilda.cc/projects/?projectid=" +
                              a.projectid +
                              "&folderid=" +
                              +a.id
                            )
                              .toLowerCase()
                              .indexOf(e) > -1
                          ) {
                            folderArr.push(a);
                          }
                        }
                      }
                    }

                    let pageCount = pageArr.length,
                      folderCount = folderArr.length,
                      sumCount = pageCount + folderCount;

                    if (sumCount) {
                      $("body").css("overflow", "hidden");
                      sumCountS += sumCount;
                      html +=
                        '<a class="name-project" href="' +
                        urlProject +
                        '" target"_blank">' +
                        nameProject +
                        "</a>";

                      if (folderCount) {
                        html +=
                          "<p class='header-category'>Папки - <span class='count-color'>" +
                          folderCount +
                          "</span></p>";

                        for (const f of folderArr) {
                          html +=
                            "<div><a href='https://tilda.cc/projects/?projectid=" +
                            f.projectid +
                            "&folderid=" +
                            f.id +
                            "' target='_blank'>" +
                            f.title +
                            "</a></div>";
                        }
                      }

                      if (pageCount) {
                        html +=
                          "<p class='header-category'>Страницы - <span class='count-color'>" +
                          pageCount +
                          "</span></p>";

                        for (const f of pageArr) {
                          function getFolderData(e) {
                            for (const a of folders) {
                              if (a.id === e) {
                                return {
                                  id: a.id,
                                  title: a.title,
                                };
                              }
                            }
                          }
                          html +=
                            "<div><a href='https://tilda.cc/page/?pageid=" +
                            f.id +
                            "&projectid=" +
                            f.projectid +
                            "' target='_blank'>" +
                            f.title +
                            "</a>      в папке      " +
                            (() => {
                              if (+f.folderid) {
                                let d = getFolderData(f.folderid);
                                return (
                                  "<a href='https://tilda.cc/projects/?projectid=" +
                                  f.projectid +
                                  "&folderid=" +
                                  d.id +
                                  "' target='_blank'>" +
                                  d.title +
                                  "</a></div>"
                                );
                              } else {
                                return (
                                  "<a href='https://tilda.cc/projects/?projectid=" +
                                  f.projectid +
                                  "' target='_blank'>Главный каталог</a></div>"
                                );
                              }
                            })();
                        }
                      }
                    }

                    if (!ch) cw = true;
                  }
                );
              }

              let int = setInterval(() => {
                if (cw) {
                  clearInterval(int);

                  setTimeout(() => {
                    if (sumCountS) {
                      $contentPanel.append(
                        "<h1>Найдено <span class='count-color'>" +
                          sumCountS +
                          "</span> " +
                          num_word(sumCountS, [
                            "совпадение",
                            "совпадения",
                            "совпадений",
                          ]) +
                          "</h1><div class='search-result'></div>"
                      );

                      let $result = $contentPanel.children(".search-result");

                      $result.append(html);
                      $inputText.add($searchButton).blur();
                      $searchWindow.addClass("show");
                    } else {
                      $warningText.text("Ничего не найдено");
                      $("body").css("overflow", "auto");
                    }
                    load = false;
                    $searchButton.text("Искать");
                  }, 1e3);
                }
              }, 500);
            }
          );
        } else {
          $("body").css("overflow", "auto");
          $searchWindow.removeClass("show");
        }
      }

      $(document).on("keyup", (e) => {
        if (e.key === "Escape" && $searchWindow.hasClass("show"))
          showSearchWindow();
      });

      $searchWindow.on("click", (e) => {
        if (e.target === e.currentTarget) showSearchWindow();
      });

      $searchButton.on("click", showSearchWindow);

      $inputText.on("keyup", (e) => {
        if (e.key === "Enter") showSearchWindow();
      });
    }
  }, 200);
});

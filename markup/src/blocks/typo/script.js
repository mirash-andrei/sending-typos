
$(function () {
    let typoInstanse;

    document.addEventListener('keydown', (e) => {

        // Отлавливаем нажатие сочетаний ctrl+enter или command+enter

        if ((e.keyCode == 10 || e.keyCode == 13) && (e.ctrlKey || e.metaKey) && document.getSelection().focusOffset) {

            if (typoInstanse) {
                // если уже есть инстанс класса Typo просто вызываем его функционал
                typoInstanse.showForm();
            } else {
                // если класс Typo еще не инициализирован динамично подгружаем модуль и создаем инстанс класса
                import('./typo.js').then(module => {
                    typoInstanse = new module.Typo();
                });
            }
        }
    })
});


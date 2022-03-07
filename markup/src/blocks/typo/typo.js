import {showModal, closeActiveModal} from '../modal/script';
import Site from '../../js/libs/site';


export class Typo {
    constructor() {
        this.typoModal = null;
        this.typoForm = null;
        this.typoText = null;
        this.typoInput = null;
        this.showForm();
        this.handlers();
    }

    handlers() {
        if (this.typoForm) {
            this.typoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendForm(this.typoForm);
            });
        }
    }

    showForm() {
        document.body.insertAdjacentHTML('beforeend', this.renderForm());

        // определяем ноды для работы с формой
        this.typoModal = document.querySelector('#typo');
        this.typoForm = this.typoModal.querySelector('.js-typo');
        this.typoText = this.typoModal.querySelector('.js-typo-text');
        this.typoInput = this.typoModal.querySelector('.js-typo-input');
        this.addSelectionText(this.typoText, this.typoInput);

        Site.loadSessid()
            .then(sessid => {
                let sessIdInput = this.typoForm.querySelector('[name="sessid"]');
                sessIdInput.value = sessid;
                showModal('#typo');
            });
    }

    addSelectionText(typoText, typoInput) {
        if (typoText) {
            typoText.innerHTML = this.getSelectionText();
        }
        if (typoInput) {
            typoInput.value = this.getSelectionText();
        }
    }

    sendForm(form) {
        let data = new FormData(form);
        data.append('action', 'typo-send-message');

        let submitBtn = form.querySelector('.js-typo-submit');
        submitBtn.disabled = true;

        fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },

            body: data,
        })
            .then(response => response.json())
            .then(result => {

                let message;

                if (result.success) {
                    message = result.sent;
                } else {
                    message = result.errors.join('\/n');
                }

                form.reset();
                submitBtn.disabled = false;

                document.body.insertAdjacentHTML('beforeend', this.renderResultForm(message));
                closeActiveModal();
                showModal('#typo-message');

                setTimeout(() => {
                    closeActiveModal();
                    document.querySelector('#typo-message').remove();
                }, 3000);
            });
    }

    getSelectionText() {
        return window.getSelection().toString().trim();
    }

    getSiteLanguage() {
        return document.documentElement.lang;
    }

    renderForm() {
        let formContent = {
            title: {
                ru: 'Отправить сообщение об опечатке',
                en: 'Send message to opka',
                es: 'Enviar mensaje a opka',
            },
            submit: {
                ru: 'Отправить',
                en: 'Send',
                es: 'Enviar',
            },
        };

        return `<div class="modal js-modal" id="typo">
                    <div class="modal-overlay">
                <div class="modal-wrap js-modal-wrap">
                    <div class="typo">
                        <div class="typo-title">${formContent.title[this.getSiteLanguage()]}</div>
                        <form class="typo-form js-modal-scroll js-typo">
                        <input type="hidden" name="sessid" value="">
                            <input type="hidden" name="url" value="${window.location.href}">
                            <div class="typo-form-text js-typo-text"></div>
                            <input class="typo-form-input js-typo-input" type="hidden" name="typo"/>
                            <textarea class="typo-form-textarea" name="comment"
                                      placeholder="Комментарий (не обязательно)"></textarea>
                            <button class="typo-form-btn js-typo-submit" type="submit">${formContent.submit[this.getSiteLanguage()]}</button>
                        </form>
                    </div>
                    <span class="modal-close js-modal-hide pseudo-link">
                        <svg><use xlink:href="#close"></use></svg>
                    </span>
                </div>
            </div>
        </div></div>`;
    }

    renderResultForm(message) {
        return `<div class="modal js-modal" id="typo-message">
                    <div class="modal-overlay">
                <div class="modal-wrap js-modal-wrap">
                    <div class="typo">
                        <div class="typo-title">${message}</div>
                    </div>
                    <span class="modal-close js-modal-hide pseudo-link">
                        <svg><use xlink:href="#close"></use></svg>
                    </span>
                </div>
            </div>
        </div></div>`;
    }
}


<?php

\Bitrix\Main\Localization\Loc::loadMessages(__FILE__);

class MetaratingsTypoComponent extends CBitrixComponent
{
    use \Metaratings\Helpers\Components\Action;

    public function onPrepareComponentParams($arParams)
    {
        $arParams['URL'] = htmlspecialchars(trim($arParams['URL']));
        $arParams['TYPO'] = htmlspecialchars(trim($arParams['TYPO']));
        $arParams['COMMENT'] = htmlspecialchars(trim($arParams['COMMENT']));

        return $arParams;
    }

    public function executeComponent()
    {
        $this->doAction();
    }


    private function validateFields($arFields)
    {
        $result = new \Bitrix\Main\Result();

        if (empty($arFields['TYPO'])) {
            $result->addError(new \Bitrix\Main\Error(__('NO_TYPO_SPECIFIED')));
            return $result;
        }

        if (empty($arFields['URL'])) {
            $result->addError(new \Bitrix\Main\Error(__('NO_LINK_SPECIFIED')));
            return $result;
        }

        return $result;
    }

    public function actionSendMessage()
    {
        $result = $this->validateFields([
            'URL' => $this->arParams['URL'],
            'TYPO' => $this->arParams['TYPO'],
        ]);

        $arResult = [
            'success' => $result->isSuccess(),
            'errors' => $result->getErrorMessages(),
        ];

        if ($arResult['success']) {
            $arResult['sent'] = __('MESSAGE_SENT');
            $sText = __('ADDRESS_WITCH_TYPO') . $this->arParams['URL'] . "\r\n";
            $sText .= __('TYPO_TEXT') . $this->arParams['TYPO'] . "\r\n";

            if (!empty($this->arParams['COMMENT']))
                $sText .= __('COMMENT') . $this->arParams['COMMENT'];

            $obNotification = new \Metaratings\Helpers\SlackNotification();

            if (Metaratings\Region::isEn()) {
                $obNotification->setChannel('metaratings_typo_eng');
            } elseif (Metaratings\Region::isEs()) {
                $obNotification->setChannel('metaratings_typo_es');
            } else {
                $obNotification->setChannel('metaratings_typo');
            }

            $obNotification->send($sText);
        }

        return json_encode($arResult);

    }
}

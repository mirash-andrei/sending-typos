<?php if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) exit;

/** @var CMain $APPLICATION */


?>

</main>

<footer class="footer">
    <div class="container">

    </div>
</footer>

<?php
$APPLICATION->IncludeComponent(
    'project:typo',
    '',
    [
        'URL' => $_REQUEST['url'],
        'TYPO' => $_REQUEST['typo'],
        'COMMENT' => $_REQUEST['comment'],
    ]
);
?>


<?php
/** Подключаем некоторые стили в футере */
$APPLICATION->AddBufferContent(['\Project\Template\Styles', 'showFooter']);
?>

<script>
    window.svgSpritePath = '<?= SITE_TEMPLATE_PATH; ?>/img/sprite.html';
</script>

<script src="<?= \CUtil::GetAdditionalFileURL(SITE_TEMPLATE_PATH . '/js/main.js', true); ?>" defer></script>
<script src="<?= \CUtil::GetAdditionalFileURL(SITE_TEMPLATE_PATH . '/js/lazy.js', true); ?>" async></script>

<?php if (\Project\Page::showCounters()) { ?>
    <?php include 'blocks/counters/body-end.php'; ?>
<?php } ?>
</body>
</html>

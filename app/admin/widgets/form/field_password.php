<?php if ($this->previewMode): ?>
    <div class="form-control-static">********</div>
<?php else: ?>
    <input
        type="password"
        name="<?= $field->getName() ?>"
        id="<?= $field->getId() ?>"
        value=""
        class="form-control"
        autocomplete="off"
        <?= $field->hasAttribute('maxlength') ? '' : 'maxlength="255"' ?>
        <?= $field->getAttributes() ?>
    />
<?php endif ?>
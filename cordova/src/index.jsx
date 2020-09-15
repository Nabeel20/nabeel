import { ActionSheet, ActionSheetItem, AlertDialog, Button, TextView, contentView, ImageView } from 'tabris';

contentView.append(
  <$>

    <Button centerX centerY onSelect={showActionSheet}>button</Button>

    <ImageView
      right={16}
      bottom={16}
      width={57}
      height={57}
      elevation={6}
      cornerRadius={28}
      highlightOnTouch
      background='#009668'
      image='\resoruces\menu-line.png'
      tintColor='white'
      onTap={showActionSheet}
    />
  </$>
);

//* ActionSheet
async function showActionSheet() {
  const actionSheet = ActionSheet.open(
    <ActionSheet title='القائمة'>
      <ActionSheetItem centerX title='إضافة ملف' />
      <ActionSheetItem title='الإحصائيات' />
      <ActionSheetItem title='امتحان مُخصص' />
      <ActionSheetItem title='حول التطبيق' />
    </ActionSheet>
  );
  const { action } = await actionSheet.onClose.promise();
}


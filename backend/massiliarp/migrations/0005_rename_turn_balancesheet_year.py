# Generated by Django 3.2.8 on 2021-10-13 12:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('massiliarp', '0004_auto_20210925_0131'),
    ]

    operations = [
        migrations.RenameField(
            model_name='balancesheet',
            old_name='turn',
            new_name='year',
        ),
    ]

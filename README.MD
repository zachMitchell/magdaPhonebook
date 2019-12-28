# Magda Phonebook
[Launch the phonebook maker!](https://zachmitchell.github.io/magdaPhonebook/)

**Magda Phonebook** was designed to make writing a phonebook a breeze. Simply add some contacts and print! (Don't worry, you can view your changes before printing it) Contacts can also be placed into categories so you can group them (For example: Family, Friends, Restaurants). When you're done, you can print the phonebook's pages and even save the phonebook to your computer or mobile device.

## File structure

Hi there! Want to edit the phonebook files without the editor? Here's how it works:

To see a sample file, please [click here.](./sampleData/sample1.txt)

The file was designed to be simple. Contacts don't need to be in a category if you wish. Each category should look something like this:

```csv
)category name,Font goes here,ColorGoesHere
```
Font and color are optional. If you specify a color though, it should always be *hex* (E.g #00FF00). Font can be anything, whether or not your computer reads it is up to you though!

Any contact under a category is now part of that category (unless a new category is defined). To reiterate above, contacts don't need to be under a category. Here's what a contact would look like:

```csv
FirstNameHere,LastNameHere,1234567890
```

That last value is the phone number. You can add symbols to the number, but the editor will take them out to focus on the numbers themselves.

One more thing you should note: this file structure is basically a **csv** file. That means commas are used to determine what each value will be next. Also keep in mind that spaces you add after a value will result in the editor taking that very literally (e.g doing that with the last name would make it " lookLikeThis").

## To-do list:

* Read iOS Contacts (vcf)
* Move contacts to other categories
* Delete Multiple contacts & categories at the same time
* Make the page relaxing to look at
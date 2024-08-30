let prefs={};

var SearchForSenderEmailAddress = {
	getAddress: async function(info) {
		if (info.selectedMessages && info.selectedMessages.messages.length > 0) {
			this.msgs=info.selectedMessages.messages;
			this.msgs.forEach( async mh => {
				console.log('address 333');
				var author = mh.author.replaceAll('\"', '');
				console.log('address 333  - author:' + author);
				var array_author = author.split('<');
				var author_emailaddress;
				if (array_author[1] && array_author[1].length > 0)
				{
					console.log('address 444');
					author_emailaddress = array_author[1].trim();
					author_emailaddress = author_emailaddress.substring(0,(author_emailaddress.length) - 1);
				}
				else
				{
					console.log('address 444-2');
					author_emailaddress = mh.author;
				}
				this.search(author_emailaddress, true, false);
			});
		} 
		else {
			console.log('SearchFor: No message selected');
		}
		return;
	},
    search : function(searchTerm, useSenderAsCriteria, useSubjectAsCriteria) {
		 browser.mailTabs.setQuickFilter({
			text: {
				text: searchTerm,
				author : useSenderAsCriteria,
				subject: useSubjectAsCriteria,
			},
		});
    },
}

var SearchForSenderName = {
	getAddress: async function(info) {
		if (info.selectedMessages && info.selectedMessages.messages.length > 0) {
			this.msgs=info.selectedMessages.messages;
			this.msgs.forEach( async mh => {
				var author = mh.author.replaceAll('\"', '');
				var array_author = author.split('<');			
				var author_name;
				if (array_author[0] && array_author[0].length > 0)
				{
					author_name = array_author[0].trim();
					author_name = author_name.replace(',', '');
				}
				else
				{
					author_name = author;
				}
				this.search(author_name, true, false);
			});
		} 
		else {
			console.log('SearchFor: No message selected');
		}
		return;
	},
    search : function(searchTerm, useSenderAsCriteria, useSubjectAsCriteria) {
		 browser.mailTabs.setQuickFilter({
			text: {
				text: searchTerm,
				author : useSenderAsCriteria,
				subject: useSubjectAsCriteria,
			},
		});
    },
}

var SearchForSenderDomain = {
	getAddress: async function(info) {
		console.log('domain 111');
		if (info.selectedMessages && info.selectedMessages.messages.length > 0) {
			console.log('domain 222');
			this.msgs=info.selectedMessages.messages;
			this.msgs.forEach( async mh => {
				console.log('domain 333');
				var author = mh.author.replaceAll('\"', '');
				console.log('domain 333 - author:' + author);
				// format:
				// 1. marco.h@aromate.com
				// 2. pe john <ask79jb@jetbean.com.tw>
				
				var author_domain = author.split('@')[1].split('>')[0];
				if (author_domain)
				{
					this.search(author_domain, true, false);
				}
				else {
					console.log('SearchFor: SenderDomain ERROR!');
				}
				
				/*var array_author = author.split('<');
				console.log('domain 333 - array_author:' + array_author);
				var author_domain;
				if (array_author[1] && array_author[1].length > 0)
				{
					console.log('domain 444');
					author_domain = array_author[1].trim();
					author_domain = author_domain.substring(0,(author_domain.length) - 1);				
				}
				else //single author
				{
					console.log('domain 444-2');
					author_domain = mh.author;

					var pos = author_domain.search("@");
					author_domain = author_domain.substring(pos, author_domain.length);
					this.search(author_domain, true, false);
				}
				//this.search(author_emailaddress, true, false);*/
			});
		} 
		else {
			console.log('SearchFor: No message selected');
		}
		return;
	},
    search : function(searchTerm, useSenderAsCriteria, useSubjectAsCriteria) {
		 browser.mailTabs.setQuickFilter({
			text: {
				text: searchTerm,
				author : useSenderAsCriteria,
				subject: useSubjectAsCriteria,
			},
		});
    },
}

var SearchForSubject = {
	getAddress: async function(info) {
		//console.log('222');
		if (info.selectedMessages && info.selectedMessages.messages.length > 0) {
			//console.log('222-1');
			this.msgs=info.selectedMessages.messages;
			this.msgs.forEach( async mh => {
				this.search(mh.subject, false, true);
			});
		} 
		else {
			console.log('SearchFor: No message selected');
		}
		return;
	},
    search : function(searchTerm, useSenderAsCriteria, useSubjectAsCriteria) {
		
		browser.mailTabs.setQuickFilter({
			text: {
				text: searchTerm,
				author : useSenderAsCriteria,
				subject: useSubjectAsCriteria,
			},
		});
    },
}

async function start() {
	//prefs=await messenger.storage.local.get({debug: false});
	let sfsender=messenger.i18n.getMessage('sfsender');
	messenger.menus.create({
		contexts : ["message_list"],
		id: "searchforsender",
		onclick : SearchForSenderEmailAddress.getAddress.bind(SearchForSenderEmailAddress),
		title: sfsender
	});
	let sfsender_name=messenger.i18n.getMessage('sfsender_name');
	messenger.menus.create({
		contexts : ["message_list"],
		id: "searchforsendername",
		onclick : SearchForSenderName.getAddress.bind(SearchForSenderName),
		title: sfsender_name
	});
	let sfsender_domain=messenger.i18n.getMessage('sfsender_domain');
	messenger.menus.create({
		contexts : ["message_list"],
		id: "searchforsenderdomain",
		onclick : SearchForSenderDomain.getAddress.bind(SearchForSenderDomain),
		title: sfsender_domain
	});
	let sfsubject=messenger.i18n.getMessage('sfsubject');
	messenger.menus.create({
		contexts : ["message_list"],
		id: "searchforsubject",
		onclick : SearchForSubject.getAddress.bind(SearchForSubject),
		title: sfsubject
	});
}

try {
    start();
} catch(e) {
    ExceptionReportHandler(e);
}

let debugcache='';
function debug(txt, force) {
	if (force || prefs) {
		if (force || prefs.debug) {
			if (debugcache) console.log(debugcache); debugcache='';
			console.log('SearchFor: '+txt);
		}
	} else {
		debugcache+='SearchFor: '+txt+'\n';
	}
}
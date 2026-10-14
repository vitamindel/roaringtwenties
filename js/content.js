/* =====================================================================
   THE NORMALCY FILES: content.js
   ALL historical content lives here: rooms, artifacts, conversations,
   narration scripts, mini-game data, courthouse questions, sources,
   music credits and team credits. Edit this file to change any text.
   Every factual claim is tied to a source id listed in SOURCES below.
   House style: no em dashes. Use commas, periods, colons or parentheses.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});

  /* -------------------------------------------------------------------
     1. TEAM CREDITS (replace the placeholder names with your group)
     ------------------------------------------------------------------- */
  const TEAM = [
    { role: 'Captain', name: '[Your name here]', duties: 'Coordinates the project, monitors progress, and makes sure the museum meets every assignment requirement.' },
    { role: 'Tech Geek', name: '[Your name here]', duties: 'Manages website development, game mechanics, visual implementation, and technical troubleshooting.' },
    { role: 'Main Researcher', name: '[Your name here]', duties: 'Verifies historical accuracy, selects artifacts, evaluates sources, and prepares the historical narration.' },
    { role: 'Secretary', name: '[Your name here]', duties: 'Tracks tasks, organizes materials and citations, and maintains the bibliography and submission documents.' },
  ];

  /* -------------------------------------------------------------------
     2. MEDIA PATHS. Missing files fall back gracefully.
     ------------------------------------------------------------------- */
  const MEDIA = {
    helpdeskVideo: 'media/video/helpdesk.mp4',
    helpdeskCaptions: 'media/captions/helpdesk.vtt',
    narration: {
      r1: 'media/audio/room1.mp3', r2: 'media/audio/room2.mp3', r3: 'media/audio/room3.mp3',
      r4: 'media/audio/room4.mp3', r5: 'media/audio/room5.mp3', r6: 'media/audio/room6.mp3',
    },
    // Streams from the Library of Congress (the Library marks it embeddable). Needs internet.
    hardingRecording: 'https://tile.loc.gov/storage-services/media/ammem/NationsForum/nforum-9000056.mp3',
  };

  /* -------------------------------------------------------------------
     3. BACKGROUND MUSIC: genuine 1920–1924 jazz recordings.
     All are in the U.S. public domain (sound recordings published before
     1926 entered the public domain under the Music Modernization Act).
     Files come from Wikimedia Commons, converted to mono MP3 and
     volume-matched for the game.
     ------------------------------------------------------------------- */
  const MUSIC = {
    hub: { src: 'media/music/hub.mp3', title: 'Riverboat Shuffle', artist: 'Bix Beiderbecke and the Wolverine Orchestra', year: '1924 (recorded May 6, 1924)', mood: 'Upbeat, welcoming hot jazz for the town square', url: 'https://commons.wikimedia.org/wiki/File:Riverboat_Shuffle_-_Bix_Beiderbecke_%26_Wolverine_Orchestra_(1924).ogg' },
    r1: { src: 'media/music/r1.mp3', title: 'Krooked Blues', artist: 'King Oliver’s Creole Jazz Band (with Louis Armstrong)', year: '1923 (recorded Oct. 5, 1923)', mood: 'Mellow early New Orleans jazz', url: 'https://commons.wikimedia.org/wiki/File:King_Oliver%27s_Creole_Jazz_Band--_%22Krooked_Blues%22_(1923).ogg' },
    r2: { src: 'media/music/r2.mp3', title: 'Modulations', artist: 'Clarence M. Jones (piano)', year: '1923', mood: 'Piano-led novelty jazz', url: 'https://commons.wikimedia.org/wiki/File:%22Modulations%22_(1923),_by_Clarence_M._Jones.oga' },
    r3: { src: 'media/music/r3.mp3', title: 'Limehouse Blues', artist: 'Arthur Lange and His Orchestra', year: '1924 (recorded Apr. 22, 1924)', mood: 'Subdued, mysterious dance-band jazz', url: 'https://commons.wikimedia.org/wiki/File:Limehouse_Blues_-_Arthur_Lange_and_his_Orchestra_(1924).mp3' },
    r4: { src: 'media/music/r4.mp3', title: 'Whispering', artist: 'Paul Whiteman and His Ambassador Orchestra', year: '1920', mood: 'Restrained, relaxed “sweet” jazz', url: 'https://commons.wikimedia.org/wiki/File:Paul_Whiteman_and_His_Ambassador_Orchestra_-_Whispering.flac' },
    r5: { src: 'media/music/r5.mp3', title: 'On the Alamo', artist: 'Benson Orchestra of Chicago', year: '1922 (recorded July 17, 1922; Victor 18931)', mood: 'Smooth, sophisticated dance orchestra', url: 'https://commons.wikimedia.org/wiki/File:On_the_Alamo_(1922,_Benson_Orchestra_of_Chicago).mp3' },
    r6: { src: 'media/music/r6.mp3', title: 'St. Louis Blues', artist: 'Handy’s Memphis Blues Band (composed by W. C. Handy)', year: '1922', mood: 'Slower, reflective blues', url: 'https://commons.wikimedia.org/wiki/File:St_Louis_Blues_-_Handy%27s_Memphis_Blues_Band_(1922_sound_recording).mp3' },
  };
  // which track plays where
  const ROOM_MUSIC = { town: 'hub', r1: 'r1', r2: 'r2', r3: 'r3', r4: 'r4', r5: 'r5', r6: 'r6', court: 'r6', library: 'r2' };

  /* -------------------------------------------------------------------
     4. HELP-DESK VIDEO SCRIPT (about 65–70 seconds)
     ------------------------------------------------------------------- */
  const HELPDESK = [
    'Hi, and welcome to The Normalcy Files, a playable museum about America from 1920 to 1929.',
    'After World War One, Warren G. Harding promised a “return to normalcy.” Our question: did normalcy really restore stability, or did it hide deeper problems?',
    'Walk with W-A-S-D or the arrow keys. On a phone, use the on-screen pad.',
    'Walk up to anything sparkling and press E or Space. Each artifact opens an archive file with its date, its creator, and whether it is a primary or secondary source.',
    'Walk into a door to enter a building, and step on the red exit mat to leave.',
    'Every room has a short mini-game marked with a gold star. You can also talk to the museum guides and pick the questions you want to ask.',
    'Press N to hear the room’s narration, with captions and a transcript.',
    'Lost? Press M for the map. You can fast-travel to any exhibit, and the gold arrow at the top of the screen always points to your next stop.',
    'Visit all six exhibits, then make your case at the Courthouse. The Library holds every source we used.',
    'Okay, let’s open the files!',
  ];

  /* -------------------------------------------------------------------
     5. THE TWO BIG QUESTIONS
     ------------------------------------------------------------------- */
  const BIG_QUESTIONS = {
    q1: 'How did the federal government’s relationship with business and the public interest shape America’s return to normalcy?',
    q2: 'Did the political and economic choices of the 1920s protect freedom and opportunity equally for all Americans?',
  };

  /* -------------------------------------------------------------------
     6. SOURCES (bibliography, MLA 9th edition style)
     type: primary | secondary | tertiary
     ------------------------------------------------------------------- */
  const SOURCES = [
    { id: 'loc-1920', type: 'secondary', mla: 'Library of Congress. “Presidential Election of 1920.” <i>From War to Normalcy: An Introduction to the Nation’s Forum Collection</i>, American Leaders Speak: Recordings from World War I and the 1920 Election, Library of Congress.', url: 'https://www.loc.gov/collections/world-war-i-and-1920-election-recordings/articles-and-essays/from-war-to-normalcy/presidential-election-of-1920/', use: 'Context for the 1920 election, the phonograph campaign, Harding’s “normalcy” message, and Coolidge’s Boston police strike telegram.' },
    { id: 'loc-readjust', type: 'primary', mla: 'Harding, Warren G. “Readjustment.” Recorded 29 June 1920, New York, Columbia Graphophone Manufacturing Company for the Nation’s Forum, N.F. 21. Library of Congress, www.loc.gov/item/2016655168/.', url: 'https://www.loc.gov/item/2016655168/', use: 'Harding’s recorded speech (streamed in Exhibit 1), recording date, and catalog details.' },
    { id: 'miller-readjust', type: 'secondary', mla: 'Miller Center. “May 14, 1920: Readjustment.” <i>Presidential Speeches</i>, University of Virginia.', url: 'https://millercenter.org/the-presidency/presidential-speeches/may-14-1920-readjustment', use: 'Full transcription of Nation’s Forum disc N.F. 21, used as the Exhibit 1 transcript after we checked it sentence by sentence against the Library of Congress audio.' },
    { id: 'herald-1920', type: 'primary', mla: '“Harding Elected by Overwhelming Vote.” <i>The New York Herald</i>, 3 Nov. 1920, p. 1. Chronicling America: Historic American Newspapers, Library of Congress.', url: 'https://www.loc.gov/resource/sn83045774/1920-11-03/ed-1/?sp=1', use: 'Front page announcing Harding’s 1920 victory (Exhibit 1).' },
    { id: 'senate-td', type: 'secondary', mla: 'United States Senate. “Senate Investigates the Teapot Dome Scandal.” <i>Powers and Procedures: Investigations</i>, U.S. Senate.', url: 'https://www.senate.gov/about/powers-procedures/investigations/senate-investigates-the-teapot-dome-scandal.htm', use: 'The Wall Street Journal report, the Kendrick resolution, the Walsh investigation, Fall’s imprisonment, and McGrain v. Daugherty.' },
    { id: 'star-1924a', type: 'primary', mla: '“Sinclair Made Fall $25,000 Loan, Probe Reveals.” <i>Evening Star</i> [Washington, D.C.], 25 Jan. 1924, p. 1. Chronicling America, Library of Congress.', url: 'https://www.loc.gov/resource/sn83045462/1924-01-25/ed-1/?sp=1', use: 'Period newspaper coverage of the Teapot Dome investigation (Exhibit 3).' },
    { id: 'star-1924b', type: 'primary', mla: '“President Pledges Stern Action in Pursuit of Guilty.” <i>Evening Star</i> [Washington, D.C.], 13 Feb. 1924, p. 1. Chronicling America, Library of Congress.', url: 'https://www.loc.gov/resource/sn83045462/1924-02-13/ed-1/?sp=1', use: 'Coolidge’s public response to the oil scandal and a “Silent Cal” cartoon (Exhibit 4).' },
    { id: 'history-fall', type: 'tertiary', mla: '“Cabinet Member Found Guilty in Teapot Dome Scandal.” <i>This Day in History</i>, A&E Television Networks.', url: 'https://www.history.com/this-day-in-history/october-25/cabinet-member-guilty-in-teapot-dome-scandal', use: 'Date of Fall’s conviction (Oct. 25, 1929), the $100,000 Doheny “loan,” and the sentence of one year and a $100,000 fine.' },
    { id: 'miller-harding', type: 'secondary', mla: 'Miller Center. “Warren G. Harding: Domestic Affairs.” <i>U.S. Presidents</i>, University of Virginia.', url: 'https://millercenter.org/president/harding/domestic-affairs', use: 'Harding’s budget reform, tax and tariff policy, the 1920–21 depression, Debs, his civil-rights speech, and the scandals of his administration.' },
    { id: 'miller-coolidge', type: 'secondary', mla: 'Miller Center. “Calvin Coolidge: Domestic Affairs.” <i>U.S. Presidents</i>, University of Virginia.', url: 'https://millercenter.org/president/coolidge/domestic-affairs', use: 'Coolidge’s tax policy with Mellon, budget surpluses, vetoes of the McNary-Haugen farm bills, press conferences and radio use, and one historian’s critical interpretation.' },
    { id: 'stat-budget', type: 'primary', mla: 'United States, Congress. <i>Budget and Accounting Act, 1921</i>. Public Law 67-13, 42 Stat. 20, 10 June 1921. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-42/pdf/STATUTE-42-Pg20.pdf', use: 'Wording and page scan of the law that created the Bureau of the Budget and the General Accounting Office.' },
    { id: 'stat-revenue', type: 'primary', mla: 'United States, Congress. <i>Revenue Act of 1921</i>. 42 Stat. 227, 23 Nov. 1921. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-42/pdf/STATUTE-42-Pg227.pdf', use: 'Title, date and first-page scan of the 1921 tax law.' },
    { id: 'stat-tariff', type: 'primary', mla: 'United States, Congress. <i>Tariff Act of 1922</i> [Fordney-McCumber Tariff]. 42 Stat. 858, 21 Sept. 1922. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-42/pdf/STATUTE-42-Pg858-2.pdf', use: 'Date, first-page scan, and wording of Section 315, the “flexible tariff” provision.' },
    { id: 'time-1923', type: 'primary', mla: '“National Affairs: Elasticity.” <i>TIME</i>, 28 Apr. 1923.', url: 'https://time.com/archive/6817817/national-affairs-elasticity/', use: 'A 1923 magazine explanation of the flexible tariff: the president could raise or lower duties by up to 50 percent on the Tariff Commission’s recommendation.' },
    { id: 'cato-tax', type: 'secondary', mla: '“The Economic Impact of Tax Changes, 1920–1939.” <i>Cato Journal</i>, Winter 2021, Cato Institute.', url: 'https://www.cato.org/cato-journal/winter-2021/economic-impact-tax-changes-1920-1939', use: 'Top income-tax rates of the 1920s (73% in 1921, 58% in 1922, 46% in 1924, 25% in 1925) and a pro-tax-cut interpretation. Note: Cato is a libertarian think tank.' },
    { id: 'dah-rail', type: 'tertiary', mla: 'Wish, Harvey. “Railway Shopmen’s Strike.” <i>Dictionary of American History</i>, Encyclopedia.com.', url: 'https://www.encyclopedia.com/history/dictionaries-thesauruses-pictures-and-press-releases/railway-shopmens-strike', use: 'The 1922 railway shopmen’s strike: start date, roughly 400,000 union members, Daugherty’s “sweeping injunction,” and the settlement.' },
    { id: 'treasury-mellon', type: 'secondary', mla: 'U.S. Department of the Treasury. “Andrew W. Mellon (1921–1932).” <i>Prior Secretaries</i>, U.S. Department of the Treasury.', url: 'https://home.treasury.gov/about/history/prior-secretaries/andrew-w-mellon-1921-1932', use: 'Andrew Mellon’s tenure as Treasury Secretary under Harding, Coolidge, and Hoover.' },
    { id: 'fiscal-debt', type: 'primary', mla: 'U.S. Department of the Treasury. “Historical Debt Outstanding.” <i>Fiscal Data</i>.', url: 'https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/', use: 'Federal debt totals: about $25.5 billion (fiscal 1919) and about $16.9 billion (fiscal 1929).' },
    { id: 'apus-asne', type: 'primary', mla: 'Coolidge, Calvin. “Address to the American Society of Newspaper Editors, Washington, D.C.” 17 Jan. 1925. <i>The American Presidency Project</i>, edited by Gerhard Peters and John T. Woolley.', url: 'https://www.presidency.ucsb.edu/documents/address-the-american-society-newspaper-editors-washington-dc', use: 'Verified quotation: “the chief business of the American people is business.”' },
    { id: 'miller-inaug25', type: 'primary', mla: 'Coolidge, Calvin. “Inaugural Address.” 4 Mar. 1925. <i>Presidential Speeches</i>, Miller Center.', url: 'https://millercenter.org/the-presidency/presidential-speeches/march-4-1925-inaugural-address', use: 'Verified quotation on the “policy of economy.”' },
    { id: 'house-inaug25', type: 'secondary', mla: 'U.S. House of Representatives. “The Inauguration of President Calvin Coolidge in 1925.” <i>Historical Highlights</i>, History, Art & Archives.', url: 'https://history.house.gov/Historical-Highlights/1901-1950/The-Inauguration-of-President-Calvin-Coolidge-in-1925/', use: 'Coolidge’s 1925 inauguration and its national radio broadcast.' },
    { id: 'ohs-dawes', type: 'secondary', mla: 'Office of the Historian. “The Dawes Plan, the Young Plan, German Reparations, and Inter-allied War Debts.” <i>Milestones: 1921–1936</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1921-1936/dawes', use: 'Reparations, the Ruhr occupation, the Dawes Plan’s terms, the cycle of loans and war debts, and the Young Plan.' },
    { id: 'ohs-kellogg', type: 'secondary', mla: 'Office of the Historian. “The Kellogg-Briand Pact, 1928.” <i>Milestones: 1921–1936</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1921-1936/kellogg', use: 'Origins, signatories, goals, Senate reservations, and limits of the Kellogg-Briand Pact.' },
    { id: 'avalon-kb', type: 'primary', mla: '“Kellogg-Briand Pact 1928.” <i>The Avalon Project: Documents in Law, History and Diplomacy</i>, Lillian Goldman Law Library, Yale Law School.', url: 'https://avalon.law.yale.edu/20th_century/kbpact.asp', use: 'Verified text of Articles I and II of the pact.' },
    { id: 'ohs-naval', type: 'secondary', mla: 'Office of the Historian. “The Washington Naval Conference, 1921–1922.” <i>Milestones: 1921–1936</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1921-1936/naval-conference', use: 'The Five-, Four-, and Nine-Power Treaties, the 5:5:3 ratio, and the conference’s limits.' },
    { id: 'ohs-league', type: 'secondary', mla: 'Office of the Historian. “The League of Nations, 1920.” <i>Milestones: 1914–1920</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1914-1920/league', use: 'Background on the League of Nations debate.' },
    { id: 'senate-versailles', type: 'secondary', mla: 'United States Senate. “The Senate’s Rejection of the Treaty of Versailles.” <i>Powers and Procedures: Treaties</i>, U.S. Senate.', url: 'https://www.senate.gov/about/powers-procedures/treaties/senate-rejects-treaty-of-versailles.htm', use: 'The Senate’s Nov. 19, 1919 rejection of the treaty and Lodge’s reservations.' },
    { id: 'ohs-immig', type: 'secondary', mla: 'Office of the Historian. “The Immigration Act of 1924 (The Johnson-Reed Act).” <i>Milestones: 1921–1936</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1921-1936/immigration-act', use: 'Quota formulas, Japanese exclusion, the 1921 law, and the Act’s purpose.' },
    { id: 'stat-quota21', type: 'primary', mla: 'United States, Congress. <i>An Act to Limit the Immigration of Aliens into the United States</i> [Emergency Quota Act]. 42 Stat. 5, 19 May 1921. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-42/pdf/STATUTE-42-Pg5.pdf', use: 'Wording and page scan of the 3-percent quota based on the 1910 census.' },
    { id: 'stat-immig24', type: 'primary', mla: 'United States, Congress. <i>Immigration Act of 1924</i>. 43 Stat. 153, 26 May 1924. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-43/pdf/STATUTE-43-Pg153-2.pdf', use: 'Wording of Section 11(a) and Section 13(c), and a scan of page 159.' },
    { id: 'aclu', type: 'secondary', mla: 'American Civil Liberties Union. “The Successes of the American Civil Liberties Union.” ACLU.', url: 'https://www.aclu.org/successes-american-civil-liberties-union', use: 'The ACLU’s founding in 1920 and its view of <i>Gitlow v. New York</i> as its first Supreme Court landmark. The ACLU is describing its own history.' },
    { id: 'lii-gitlow', type: 'primary', mla: '<i>Gitlow v. New York</i>. 268 U.S. 652, U.S. Supreme Court, 8 June 1925. Legal Information Institute, Cornell Law School.', url: 'https://www.law.cornell.edu/supremecourt/text/268/652', use: 'Searchable text of Justice Sanford’s majority opinion and Justice Holmes’s dissent.' },
    { id: 'usrep-gitlow', type: 'primary', mla: '<i>U.S. Reports: Gitlow v. New York, 268 U.S. 652 (1925)</i>. Library of Congress, Law Library.', url: 'https://www.loc.gov/item/usrep268652/', use: 'Page scans (pp. 652, 666 and 673) of the official printed opinion, shown in Exhibit 6.' },
    { id: 'nara-migration', type: 'secondary', mla: 'National Archives. “The Great Migration (1910–1970).” <i>African American Heritage</i>, U.S. National Archives and Records Administration.', url: 'https://www.archives.gov/research/african-americans/migrations/great-migration', use: 'Scale, causes, and destinations of the Great Migration, and the discrimination migrants faced.' },
    { id: 'ohs-tulsa', type: 'secondary', mla: '“Tulsa Race Massacre.” <i>The Encyclopedia of Oklahoma History and Culture</i>, Oklahoma Historical Society.', url: 'https://www.okhistory.org/publications/enc/entry?entry=TU013', use: 'The Tulsa Race Massacre of May 31–June 1, 1921: duration, destruction, and death estimates.' },
    { id: 'naacp-dyer', type: 'secondary', mla: 'NAACP. “Dyer Anti-Lynching Bill.” <i>History Explained: Legislative Milestones</i>, NAACP.', url: 'https://naacp.org/find-resources/history-explained/legislative-milestones/dyer-anti-lynching-bill', use: 'The Dyer Anti-Lynching Bill: passed by the House in 1922 and blocked in the Senate.' },
    { id: 'fbi-palmer', type: 'secondary', mla: 'Federal Bureau of Investigation. “Palmer Raids.” <i>FBI History: Famous Cases and Criminals</i>, FBI.', url: 'https://www.fbi.gov/history/famous-cases/palmer-raids', use: 'The 1919 bombings and the Palmer Raids of the First Red Scare.' },
    { id: 'ushistory-46', type: 'secondary', mla: 'Independence Hall Association. “The Decade That Roared.” <i>U.S. History Online Textbook</i>, ushistory.org.', url: 'https://www.ushistory.org/us/46.asp', use: 'Class starting point: the consumer economy, automobiles, radio, and cultural change in the 1920s.' },
    { id: 'ocpl-doughboy', type: 'secondary', mla: 'Ohio County Public Library. “The Doughboy Monument.” <i>Wheeling History</i>, Ohio County Public Library.', url: 'https://www.ohiocountylibrary.org/wheeling-history/the-doughboy-monument/5162', use: 'Dedication of Wheeling’s Doughboy statue on Memorial Day, May 30, 1931, and its sculptor, E. M. Viquesney.' },
    // --- Library of Congress photographs and prints (primary sources) ---
    { id: 'p-harding', type: 'primary', mla: '<i>Warren G. Harding</i>. Photograph, between 1921 and 1923. Library of Congress Prints and Photographs Division, LC-USZ62-29218.', url: 'https://www.loc.gov/item/2002695720/', use: 'Portrait of President Harding (Exhibit 2).' },
    { id: 'p-porch', type: 'primary', mla: '<i>Senator Warren G. Harding, Republican Nominee for President, Posing in the Shade of His Front Porch at Marion, Ohio</i>. Photograph, 22 Oct. 1920. Library of Congress, LC-USZ62-70724.', url: 'https://www.loc.gov/item/2003654862/', use: 'Harding during the 1920 campaign (Exhibit 1).' },
    { id: 'p-inaug', type: 'primary', mla: '<i>Harding Inauguration, March 4th, 1921</i>. Panoramic photograph, 4 Mar. 1921. Library of Congress, LC-USZ62-122406.', url: 'https://www.loc.gov/item/2007663486/', use: 'Harding’s inauguration (Exhibit 2).' },
    { id: 'p-cabinet', type: 'primary', mla: 'National Photo Company. <i>Harding Cabinet Outside</i>. Glass negative, 1921. Library of Congress, LC-DIG-npcc-03671.', url: 'https://www.loc.gov/item/2016829902/', use: 'Harding and his cabinet (Exhibit 2).' },
    { id: 'p-coolidge', type: 'primary', mla: '<i>Calvin Coolidge, Head-and-Shoulders Portrait, Facing Right</i>. Photograph, c. 4 Dec. 1923. Library of Congress, LC-USZ62-13030.', url: 'https://www.loc.gov/item/96522645/', use: 'Portrait of President Coolidge (Exhibit 4).' },
    { id: 'p-plymouth', type: 'primary', mla: '<i>First Correct Composite Photograph Made of President Coolidge’s First Dramatic Inaugural in Plymouth, Vt.</i> Composite photograph, c. 1925. Library of Congress, LC-USZ62-7885.', url: 'https://www.loc.gov/item/2011647457/', use: 'A 1925 composite image recreating Coolidge’s August 1923 oath of office (Exhibit 4).' },
    { id: 'p-radio', type: 'primary', mla: 'National Photo Company. <i>Hoover & Coolidge: Coolidge Addressing Radio Men at White House</i>. Glass negative, 8 Oct. 1924. Library of Congress, LC-DIG-npcc-26256.', url: 'https://www.loc.gov/item/2016849590/', use: 'Coolidge and the new medium of radio (Exhibit 4).' },
    { id: 'p-farmers', type: 'primary', mla: '<i>Calvin Coolidge on the White House Lawn, with Members of the House Agricultural Committee and a Group of Western Farmers</i>. Photograph, 12 Jan. 1924. Library of Congress, LC-USZ62-110626.', url: 'https://www.loc.gov/item/94505218/', use: 'Farm delegation at the White House (Exhibit 4).' },
    { id: 'p-taxbill', type: 'primary', mla: '<i>Calvin Coolidge Signing the Income Tax Bill, Also Known as the Mellon Tax Bill</i>. Photograph, 26 Feb. 1926. Library of Congress, LC-USZ62-110627.', url: 'https://www.loc.gov/item/94505220/', use: 'Signing of the Revenue Act of 1926 (Exhibit 4).' },
    { id: 'p-fall', type: 'primary', mla: 'National Photo Company. <i>Albert B. Fall</i>. Glass negative, 1921. Library of Congress, LC-DIG-npcc-03798.', url: 'https://www.loc.gov/item/2016830028/', use: 'Interior Secretary Albert B. Fall (Exhibit 3).' },
    { id: 'p-sinclair', type: 'primary', mla: 'Harris & Ewing. <i>Harry F. Sinclair, Multimillionaire Oil Magnate (Left) and His Counsel Martin W. Littleton. Teapot Dome Hearing</i>. Glass negative, 1924. Library of Congress, LC-DIG-hec-44031.', url: 'https://www.loc.gov/item/2016893277/', use: 'Sinclair at the Senate hearings (Exhibit 3).' },
    { id: 'p-doheny', type: 'primary', mla: '<i>Edward L. Doheny and His Lawyer Frank J. Hogan</i>. Photograph, 1 Feb. 1924. Library of Congress, LC-USZ62-51321.', url: 'https://www.loc.gov/item/2002695652/', use: 'Doheny during the investigation (Exhibit 3).' },
    { id: 'p-senateoil', type: 'primary', mla: 'Williams, Gluyas. <i>The Senate Discusses the Oil Scandal (Senators Walsh and Lenroot, Who Know Most about It, in the Foreground)</i>. Drawing, published 1924. Library of Congress, LC-USZ62-100717.', url: 'https://www.loc.gov/item/90713816/', use: 'A 1924 illustration of the Senate oil debate (Exhibit 3).' },
    { id: 'p-dawes', type: 'primary', mla: '<i>Charles Dawes</i>. Photograph, c. 1924. Library of Congress, LC-USZ6-849.', url: 'https://www.loc.gov/item/2002723307/', use: 'Charles G. Dawes (Exhibits 2 and 5).' },
    { id: 'p-naval', type: 'primary', mla: 'Harris & Ewing. <i>[The Conference on Limitation of Armaments, Washington, D.C.]</i>. Glass negative, 1921 or 1922. Library of Congress, LC-DIG-hec-31562.', url: 'https://www.loc.gov/item/2016886511/', use: 'The Washington Naval Conference in session (Exhibit 5).' },
    { id: 'p-hughes', type: 'primary', mla: '<i>Secty of State Hughes Signing the Treaties Resulting from the Conference of Limitation of Armaments Today</i>. Photograph, 5 Feb. 1922. Library of Congress, LC-USZ6-1755.', url: 'https://www.loc.gov/item/91730757/', use: 'Hughes signing the naval treaties (Exhibit 5).' },
    { id: 'p-kelloggpact', type: 'primary', mla: '<i>[Calvin Coolidge, Herbert Hoover, and Frank B. Kellogg, Standing, with Representatives of the Governments Who Have Ratified the Treaty for Renunciation of War]</i>. Photograph, 24 July 1929. Library of Congress, LC-USZ62-111722.', url: 'https://www.loc.gov/item/94509170/', use: 'The White House ceremony when the Kellogg-Briand Pact took effect (Exhibit 5).' },
    { id: 'p-ellis', type: 'primary', mla: '<i>Immigrants at Ellis Island</i>. Photograph, between 1907 and 1917. Library of Congress, LC-USZ62-26543.', url: 'https://www.loc.gov/item/97501640/', use: 'Immigrants at Ellis Island before the quota laws (Exhibit 6).' },
    { id: 'p-tulsa', type: 'primary', mla: 'American National Red Cross. <i>After the Race Riots June 1st, 1921, Tulsa, Okla.</i> Photograph, June 1921. Library of Congress, LC-DIG-anrc-14737.', url: 'https://www.loc.gov/item/2017679759/', use: 'Destruction in Tulsa’s Greenwood district after the 1921 massacre (Exhibit 6). The title uses the period term “race riots.”' },
    { id: 'p-palmer', type: 'primary', mla: 'Harris & Ewing. <i>[U.S. Attorney General Alexander Mitchell Palmer, Half-Length Portrait, Facing Front]</i>. Photograph, 1919. Library of Congress, LC-DIG-ds-07209.', url: 'https://www.loc.gov/item/2005691410/', use: 'Attorney General A. Mitchell Palmer (Exhibits 1 and 6).' },
    { id: 'p-mellon', type: 'primary', mla: '<i>Mellon, Andrew, Portrait Photograph</i>. 26 Nov. 1924. Library of Congress, LC-G412-T-4559.', url: 'https://www.loc.gov/item/2018714243/', use: 'Treasury Secretary Andrew Mellon (Exhibits 2 and 4).' },
    { id: 'p-teapot', type: 'primary', mla: 'Highsmith, Carol M. <i>Teapot Rock, a Distinctive Sedimentary Rock Formation in Natrona County, Wyoming</i>. Digital photograph, 29 May 2016. Carol M. Highsmith Archive, Library of Congress, LC-DIG-highsm-38168.', url: 'https://www.loc.gov/item/2017688060/', use: 'Modern photograph of the rock that gave Teapot Dome its name (Exhibit 3).' },
    { id: 'p-doughboy', type: 'primary', mla: 'Highsmith, Carol M. <i>The “Spirit of the American Doughboy” World War I Memorial at Wheeling Park in Wheeling, West Virginia</i>. Digital photograph, 10 May 2015. Carol M. Highsmith Archive, Library of Congress, LC-DIG-highsm-31946.', url: 'https://www.loc.gov/item/2015632021/', use: 'Photograph of a real Doughboy memorial (Town Square memorial popup).' },
    { id: 'p-rail', type: 'primary', mla: '<i>Guards on Duty during the Railroad Strike</i>. Photograph, 10 Aug. 1922. Library of Congress, LC-USZ62-96759.', url: 'https://www.loc.gov/item/89709484/', use: 'The 1922 railroad strike (Exhibit 2).' },
    { id: 'p-steel', type: 'primary', mla: '<i>Strike Leader at Gary, Ind., Advising Strikers</i>. Photograph, 1919. Library of Congress, LC-USZ62-77539.', url: 'https://www.loc.gov/item/2002695621/', use: 'The 1919 steel strike (Exhibit 1).' },
    { id: 'p-parade', type: 'primary', mla: '<i>[Large Parade; Welcoming Armed Forces Home. Buffalo, N.Y., 1919]</i>. Photograph, c. 1919. Library of Congress, LC-USZ62-29645.', url: 'https://www.loc.gov/item/2013648114/', use: 'Demobilization and homecoming after World War I (Exhibit 1).' },
    { id: 'p-rouge', type: 'primary', mla: 'Detroit Publishing Company. <i>[Ford Motor Company River Rouge Plant, Dearborn, Air View]</i>. Photograph, 1927?. Library of Congress, LC-DIG-det-4a25915.', url: 'https://www.loc.gov/item/2016800582/', use: 'Industrial mass production in the 1920s (Exhibits 2 and 4).' },
    // --- music ---
    { id: 'm-commons', type: 'primary', mla: 'Wikimedia Commons. Public-domain sound recordings, 1920–1924: Bix Beiderbecke and the Wolverine Orchestra, “Riverboat Shuffle” (1924); King Oliver’s Creole Jazz Band, “Krooked Blues” (1923); Clarence M. Jones, “Modulations” (1923); Arthur Lange and His Orchestra, “Limehouse Blues” (1924); Paul Whiteman and His Ambassador Orchestra, “Whispering” (1920); Benson Orchestra of Chicago, “On the Alamo” (1922); Handy’s Memphis Blues Band, “St. Louis Blues” (1922).', url: 'https://commons.wikimedia.org/wiki/Category:Jazz', use: 'Background music. Individual file links are listed in the Library’s music credits.' },
  ];

  /* -------------------------------------------------------------------
     7. ROOMS
     objective: one short line shown in the HUD
     ------------------------------------------------------------------- */
  const ROOMS = {
    r1: {
      num: 1, title: 'The Aftermath of World War I', building: 'Union Station', short: 'Aftermath of WWI', color: '#7a3a2e',
      question: 'Why did Americans want a return to normalcy?',
      objective: 'Examine the sparkling exhibits, then try the ticket window game.',
      narration: [
        'Picture this station in 1919. The war is over and trains are bringing soldiers home, but home does not feel calm.',
        'Factories that ran on war orders are slowing down. Prices jumped during the war, and then the economy fell into a sharp depression in 1920 and 1921. Wages dropped and more than twenty thousand businesses failed.',
        'Workers went on strike across the country: in Seattle, in the steel mills, and even among the Boston police. After a string of bombings in 1919, many Americans feared a communist revolution, and federal agents arrested thousands of suspected radicals in the Palmer Raids.',
        'And President Wilson’s fight to join the League of Nations ended in defeat in the Senate.',
        'So when Senator Warren G. Harding said America needed “not heroics, but healing… not revolution, but restoration,” a lot of tired voters listened. In November 1920 he won about sixty percent of the popular vote.',
        'Remember, though: not every American wanted the same thing from normalcy, and the problems in this room did not disappear on election day. Let’s follow Harding to the White House and see what normalcy looked like in practice.',
      ],
    },
    r2: {
      num: 2, title: 'Inside Harding’s White House', building: 'The White House', short: 'Harding’s White House', color: '#2c4a6a',
      question: 'What did normalcy mean for government and business?',
      objective: 'Read the three laws on the desk, then play the cabinet-table game.',
      narration: [
        'Welcome to Warren Harding’s White House. He served from March 1921 until he died in August 1923.',
        'It is easy to think normalcy meant the government simply did nothing. That is not quite right. Harding’s government made deliberate choices.',
        'In 1921 he signed the Budget and Accounting Act, which made the president send Congress one complete federal budget every year and created an independent office to audit government spending.',
        'His Treasury Secretary, Andrew Mellon, pushed tax cuts, starting with the Revenue Act of 1921. In 1922 the Fordney-McCumber Tariff raised taxes on imported goods to protect American manufacturers.',
        'Supporters said these policies would build business confidence and bring back prosperity. Critics said they helped the wealthy and big industry most.',
        'Labor felt that tension directly. When about four hundred thousand railroad shop workers went on strike in 1922, Harding’s attorney general won a sweeping court order against them.',
        'So normalcy was a set of choices about whom government should help, and how. Next, let’s see what happened when some officials used public power for private gain.',
      ],
    },
    r3: {
      num: 3, title: 'The Teapot Dome Scandal', building: 'The Daily Ledger', short: 'Teapot Dome', color: '#4a3a2a',
      question: 'What happens when public office serves private interests?',
      objective: 'Study the evidence board, then open the case file on the editor’s desk.',
      narration: [
        'Grab a notebook, reporter. Something smells like oil.',
        'Before the war, the government set aside oil fields as an emergency fuel supply for the Navy: one at Elk Hills in California, and one under a rock formation in Wyoming called Teapot Dome.',
        'In 1921, President Harding moved control of these reserves from the Navy to the Interior Department, run by Secretary Albert B. Fall.',
        'Fall then leased the reserves to two oilmen, Harry Sinclair and Edward Doheny, secretly and without competitive bidding. Around the same time, Fall suddenly had a lot of money.',
        'In April 1922, the Wall Street Journal reported the Teapot Dome lease, and the Senate opened an investigation. Senator Thomas Walsh asked the key question: how did Fall get so rich so quickly?',
        'The answer included a one-hundred-thousand-dollar “loan” from Doheny. In 1929, Fall was convicted of accepting a bribe, the first former cabinet officer to go to prison.',
        'Here is the careful part. Harding died in 1923, before most of this came out, and there is no evidence he took oil bribes himself. Good reporting separates proof from rumor.',
        'So ask yourself: what safeguards should stop officials from using public resources for private gain?',
      ],
    },
    r4: {
      num: 4, title: 'The Age of Calvin Coolidge', building: 'Treasury & Press Hall', short: 'Age of Coolidge', color: '#3a5a3a',
      question: 'Was quiet government good government?',
      objective: 'Compare the farm display with the stock ticker, then balance the budget.',
      narration: [
        'On August 3rd, 1923, Calvin Coolidge became president after Harding’s sudden death. He won a full term in 1924 and served until March 1929.',
        'People called him “Silent Cal,” but he was not absent. He held more than five hundred press conferences and spoke on the radio regularly. He chose his words carefully, and his image was calm, honest, and thrifty.',
        'Coolidge believed in a limited federal government. With Treasury Secretary Andrew Mellon, he cut income taxes several times, ran budget surpluses, and paid down the national debt.',
        'Supporters credited these policies for the boom: cars, radios, electric appliances, and rising stock prices.',
        'But prosperity was uneven. Farmers struggled with low crop prices all decade, and Coolidge twice vetoed the McNary-Haugen farm bills meant to help them. Many people also bought stocks and goods on credit.',
        'The Great Depression began after Coolidge left office, and historians still debate how much the policies of the 1920s contributed. Growth and limited government defined this era, but prosperity did not reach every American equally.',
      ],
    },
    r5: {
      num: 5, title: 'America and the World', building: 'Hall of Nations', short: 'America & the World', color: '#5a3a6a',
      question: 'Was America really turning inward?',
      objective: 'Follow the money on the great map, then rebuild the cycle at the map table.',
      narration: [
        'It is often said that after World War One, America turned its back on the world. The United States never joined the League of Nations; the Senate rejected the Treaty of Versailles in 1919.',
        'But follow the money and the story gets more complicated.',
        'During the war, the United States lent the Allies more than ten billion dollars, and Washington expected to be repaid. Meanwhile, Germany owed huge reparations to Britain and France.',
        'In 1923, Germany fell behind on payments, France and Belgium occupied the Ruhr valley, and German money collapsed. In 1924, the Dawes Plan, led by the American banker Charles Dawes, reduced Germany’s payments and arranged a large international loan.',
        'For about four years, American banks lent money to Germany, Germany paid reparations to the Allies, and the Allies paid their war debts back to the United States. It worked, as long as American loans kept flowing.',
        'The United States also led the Washington Naval Conference to limit warships, and helped create the Kellogg-Briand Pact to renounce war, though neither could be enforced.',
        'So normalcy did not mean America had no international responsibilities. It meant choosing which ones to accept.',
      ],
    },
    r6: {
      num: 6, title: 'Normalcy for Whom?', building: 'Community Hall', short: 'Normalcy for Whom?', color: '#6a5a2a',
      question: 'Did everyone benefit from America’s return to normalcy?',
      objective: 'Read the displays with care, then meet the six people at the card table.',
      narration: [
        'So far we have looked at presidents, policies, and money. Now let’s ask a harder question: normalcy for whom?',
        'In 1921 and again in 1924, Congress passed laws that sharply limited immigration. The 1924 law based its quotas on the 1890 census, which favored immigrants from northern and western Europe, cut visas for southern and eastern Europeans, and barred almost all immigration from Asia, including Japan.',
        'Fear of radicals also shaped this era. Benjamin Gitlow was convicted in New York for publishing a socialist manifesto. In 1925 the Supreme Court upheld his conviction, but it also said free speech is protected from state governments, not just Congress. He lost, but the Constitution grew.',
        'For many Black Americans, the twenties brought both new opportunities in Northern cities through the Great Migration and terrible violence, like the Tulsa Race Massacre of 1921. A federal anti-lynching bill passed the House in 1922 but died in the Senate.',
        'Normalcy was a political ideal, not one shared experience.',
        'So here is the question to carry into the courthouse: can a country truly return to normal if its definition of normal excludes or disadvantages some of its people?',
      ],
    },
    court: {
      num: 7, title: 'Judge Normalcy', building: 'Courthouse', short: 'Courthouse', color: '#3a2a2a',
      question: 'Did America’s return to normalcy succeed?',
      objective: 'Walk up to the judge’s bench to give your verdict and written answers.',
    },
    library: {
      num: 8, title: 'The Reference Library', building: 'Public Library', short: 'Library', color: '#2a3a4a',
      question: 'Where does the evidence come from?',
      objective: 'Browse the card catalog, credits, scripts and music credits.',
    },
  };

  /* -------------------------------------------------------------------
     8. ARTIFACTS
     kind: short label of what the object is
     summary: one-sentence description of the object itself
     background / tells / limits / more: paragraphs (more is optional reading)
     images: [{src, caption, alt, credit}] shown in the gallery
     ------------------------------------------------------------------- */
  const IMG = 'assets/archive/';
  const ARTIFACTS = {
    /* ================= EXHIBIT 1 ================= */
    r1_recording: {
      room: 'r1', title: 'Harding’s “Readjustment” Recording', kind: 'Sound recording (78-rpm disc)', date: 'Recorded June 29, 1920, in New York City',
      creator: 'Warren G. Harding, speaker. Made by the Columbia Graphophone Manufacturing Company for the Nation’s Forum (disc N.F. 21).', type: 'primary',
      summary: 'A four-minute phonograph record in which Senator Harding, the Republican nominee, reads his best-known campaign speech.',
      media: { kind: 'audio', src: MEDIA.hardingRecording },
      images: [{ src: IMG + 'harding_porch.jpg', caption: 'Senator Harding on the front porch of his home in Marion, Ohio, posing for a sculptor, October 22, 1920.', alt: 'Warren Harding seated outdoors beside a sculptor working on a bust of him', credit: 'Library of Congress, LC-USZ62-70724' }],
      transcript: {
        speaker: 'Warren G. Harding', context: 'Recorded for the Nation’s Forum on June 29, 1920. The speech is based on Harding’s address to the Home Market Club of Boston on May 14, 1920.',
        note: 'Complete recording; nothing has been cut. Transcription by the Miller Center (University of Virginia) of Nation’s Forum disc N.F. 21. We checked it sentence by sentence against the Library of Congress audio played here. Spelling follows the Miller Center transcription.',
        lines: [
          [0, 'My countrymen, there isn’t anything the matter with the world’s civilization except that humanity is viewing it through a vision impaired in a cataclysmal war.'],
          [20, 'Poise has been disturbed, and nerves have been wracked, and fever has rendered men irrational.'],
          [28, 'Sometimes there have been draughts upon the dangerous cup of barbarity.'],
          [32, 'Men have wandered far from safe paths, but the human procession still marches in the right direction.'],
          [41, 'Here in the United States we feel the reflex, rather than the hurting wound itself, but we still think straight; and we mean to act straight; we mean to hold firmly to all that was ours when war involved us and seek the higher attainments which are the only compensations that so supreme a tragedy may give mankind.'],
          [65, 'America’s present need is not heroics, but healing; not nostrums, but normalcy; not revolution, but restoration; not agitation, but adjustment; not surgery, but serenity; not the dramatic, but the dispassionate; not experiment, but equipoise; not submergence in internationality but sustainment in triumphant nationality.'],
          [92, 'It’s one thing to battle successfully against the world’s domination by a military autocracy because the infinite God never intended such a program; but it’s quite another thing to revise human nature and suspend the fundamental laws of life and all of life’s requirements.'],
          [112, 'The world calls for peace.'],
          [114, 'America demands peace, formal as well as actual, and means to have it so we may set our own house in order.'],
          [123, 'We challenged the proposal that an armed autocrat should dominate the world, and we choose for ourselves to cling to the representative democracy which made us what we are.'],
          [136, 'This republic has its ample task.'],
          [139, 'If we put an end to false economics which lure humanity to utter chaos, ours will be the commanding example of world leadership today.'],
          [149, 'If we can prove a representative popular government under which the citizenship seeks what it may do for the government and country, rather than what the country may do for individuals, we shall do more to make democracy safe for the world than all armed conflict ever recorded.'],
          [169, 'The world needs to be reminded that all human ills are not curable by legislation, and that quantity of statutory enactments and excess of government offer no substitute for quality of citizenship.'],
          [185, 'The problems of maintained civilization are not to be solved by a transfer of responsibility from citizenship to government and no eminent page in history was ever drafted to the standards of mediocrity.'],
          [200, 'Nor, no government worthy of the name which is directed by influence on the one hand or moved by intimidation on the other.'],
          [209, 'My best judgement of America’s need is to steady down, to get squarely on our feet, to make sure of the right path.'],
          [219, 'Let’s get out of the fevered delirium of war with the hallucination that all the money in the world is to be made in the madness of war and the wildness of its aftermath.'],
          [230, 'Let us stop to consider that tranquility at home is more precious than peace abroad and that both our good fortune and our eminence are dependent on the normal forward stride of all the American people.'],
          [247, 'We want to go on, secure and unafraid, holding fast to the American inheritance, and confident of the supreme American fulfillment.'],
        ],
      },
      background: [
        'In 1920, before most families owned radios, candidates reached voters through phonograph records. The Library of Congress calls the 1920 race the last presidential campaign made accessible to the public solely through record albums. By election night, the first commercial radio broadcast of election returns had changed that.',
        'Harding first delivered these words in Boston on May 14, 1920. Six weeks later he re-recorded them in a New York studio. The disc runs 4 minutes and 22 seconds, and its other side holds a military march played by Prince’s Band.',
      ],
      tells: 'Listen to how Harding diagnoses the country. He treats the war as a fever that left people “irrational,” and he offers steadiness instead of new programs. Two lines reveal his view of government: “all human ills are not curable by legislation,” and Americans should not transfer “responsibility from citizenship to government.” The famous “not… but…” list sets normalcy against Wilson-era “experiment” and “internationality.”',
      limits: 'This is a studio re-creation, not a recording of a live crowd, and a campaign speech is a sales pitch. It tells us what Harding wanted voters to hear in 1920, not what he actually did as president. For that, visit Exhibit 2.',
      more: [
        'The word “normalcy” was unusual in 1920, and critics teased Harding for it. The Miller Center notes that the word was not his invention; it had appeared in English long before.',
        'The Nation’s Forum also recorded other 1920 candidates, including Calvin Coolidge, Harding’s running mate.',
      ],
      why: 'Harding’s promise was about the size and direction of government: less “experiment,” more “restoration,” and a focus on America first. That promise is the starting point for asking how government treated business and the public interest in the years that followed.',
      question: 'Pick two of Harding’s “not… but…” pairs. What fear or frustration from 1919–1920 is each pair answering?',
      thinking: '“Not revolution, but restoration” speaks to Red Scare fears. “Not submergence in internationality” speaks to the League of Nations fight. “Not experiment” pushes back against wartime and Progressive-era government programs.',
      sources: ['loc-readjust', 'miller-readjust', 'loc-1920', 'p-porch'],
    },
    r1_herald: {
      room: 'r1', title: 'Front Page: “Harding Elected by Overwhelming Vote”', kind: 'Newspaper front page', date: 'November 3, 1920',
      creator: 'The New York Herald', type: 'primary',
      summary: 'The front page of a major New York daily on the morning after the 1920 presidential election.',
      media: { kind: 'newspaper', src: IMG + 'news_herald_1920.jpg', caption: 'The New York Herald, November 3, 1920, page 1. Drag to move around the page; use the + and − buttons to zoom.' },
      background: [
        'Harding and his running mate, Massachusetts governor Calvin Coolidge, defeated the Democratic ticket of James M. Cox and Franklin D. Roosevelt. The Republicans won about 60 percent of the popular vote, a landslide by any measure.',
        'It was the first presidential election held after the Nineteenth Amendment guaranteed women the right to vote, so the electorate itself was larger and new.',
      ],
      tells: 'The headlines report more than Harding’s win. They describe Republicans gaining in Congress and “Wilson majorities of 1916 overturned” in cities like Chicago and Boston. A new president with a friendly Congress could actually carry out a program, which is what happens with taxes, tariffs and immigration in Exhibits 2 and 6.',
      limits: 'An election-night paper reports results before every vote is counted, and the Herald had its own editorial leanings. Use it to understand the mood of the moment, then confirm the final numbers elsewhere.',
      why: 'The size of the victory shows how strongly many voters wanted a break from war, strikes and economic turmoil. It gave the promise of normalcy a mandate.',
      question: 'Zoom into the headlines. Besides Harding’s win, what other changes does the paper report? Why might a big margin matter for a new president?',
      thinking: 'The page reports Republicans tightening control of the Senate and Wilson’s old city majorities turning against his party. A large margin gives a new president political capital in Congress.',
      sources: ['herald-1920', 'loc-1920'],
    },
    r1_parade: {
      room: 'r1', title: 'Welcome Home: Demobilization, 1919', kind: 'Photograph', date: 'About 1919',
      creator: 'Photographer unknown. Library of Congress Prints and Photographs Division.', type: 'primary',
      summary: 'A huge crowd lines a city street as troops march home in Buffalo, New York.',
      images: [{ src: IMG + 'parade_1919.jpg', caption: 'Large parade welcoming armed forces home, Buffalo, New York, about 1919.', alt: 'Crowds lining a wide street as soldiers march past a domed building decorated with flags', credit: 'Library of Congress, LC-USZ62-29645' }],
      background: [
        'After the armistice of November 11, 1918, more than four million Americans who had served began coming home. Cities held victory parades like this one in Buffalo.',
        'The celebration hid real strain. Wartime factories lost their government contracts, returning veterans looked for jobs, and prices that had climbed during the war stayed high. Then, in 1920 and 1921, a sharp depression hit: wages fell and more than 20,000 businesses failed.',
      ],
      tells: 'The photograph shows pride and relief. The size of the crowd suggests how deeply the war had touched ordinary communities.',
      limits: 'A parade photo cannot show jobs, wages or prices, and it cannot show the experiences of veterans who were not celebrated equally, including Black soldiers who returned to segregation. A historian would pair it with economic data, letters and newspapers.',
      why: 'Celebration and anxiety existed side by side in 1919. Harding’s promise of “healing” spoke to both.',
      question: 'This photo shows celebration. What does it not show about life for returning soldiers? What other sources would you need?',
      thinking: 'It cannot show employment, prices or discrimination. Employment statistics, veterans’ letters and newspapers from different communities would fill the gaps.',
      sources: ['p-parade', 'miller-harding'],
    },
    r1_strike: {
      room: 'r1', title: 'The Steel Strike of 1919', kind: 'Photograph', date: '1919',
      creator: 'Photographer unknown. Library of Congress Prints and Photographs Division.', type: 'primary',
      summary: 'A strike leader addresses a large crowd of steelworkers in Gary, Indiana.',
      images: [{ src: IMG + 'steel_strike.jpg', caption: 'Strike leader at Gary, Indiana, advising strikers, 1919.', alt: 'A man standing on a balcony speaking to a large crowd of men below', credit: 'Library of Congress, LC-USZ62-77539' }],
      background: [
        '1919 was one of the most strike-filled years in American history. Seattle workers held a general strike in February. In September, Boston police officers walked off the job, and a nationwide steel strike began soon after. Steelworkers wanted union recognition and relief from long shifts; the strike ended in early 1920 without winning recognition.',
        'During the Boston police strike, Massachusetts governor Calvin Coolidge telegraphed labor leader Samuel Gompers: “There is no right to strike against the public safety by anyone, anywhere, any time.” The line made Coolidge nationally famous and helped put him on the 1920 Republican ticket.',
      ],
      tells: 'The size of the crowd shows how organized and determined workers were. Strikes on this scale also explain why many middle-class Americans began to link labor activism with disorder.',
      limits: 'The photograph shows one moment in one city. It does not tell us what the speaker said, how the strike ended, or how townspeople reacted.',
      why: 'For a striking worker, “getting back to normal” might mean fair wages. For an employer, it might mean an end to strikes. Normalcy meant different things to different people from the very start.',
      question: 'How might a striking steelworker and a factory owner each define “getting back to normal” in 1919?',
      sources: ['p-steel', 'loc-1920'],
    },
    r1_redscare: {
      room: 'r1', title: 'The Red Scare, 1919–1920', kind: 'Museum timeline with an archival portrait', date: 'Events of 1918–1920',
      creator: 'Assembled by the museum team from the sources listed below.', type: 'secondary',
      summary: 'A timeline of the year that made many Americans long for calm, with a 1919 portrait of the attorney general who led the Palmer Raids.',
      images: [{ src: IMG + 'palmer.jpg', caption: 'U.S. Attorney General A. Mitchell Palmer, 1919. Photograph by Harris & Ewing.', alt: 'Portrait of A. Mitchell Palmer in a suit', credit: 'Library of Congress, LC-DIG-ds-07209' }],
      media: { kind: 'timeline', items: [
        ['Nov. 11, 1918', 'The armistice ends the fighting in World War I.'],
        ['1919', 'Strikes in Seattle, in the steel industry, and in the Boston police force.'],
        ['June 2, 1919', 'Bombs explode in several cities; one damages Attorney General A. Mitchell Palmer’s home in Washington.'],
        ['Nov. 19, 1919', 'The Senate rejects the Treaty of Versailles, and with it U.S. membership in the League of Nations.'],
        ['Nov. 1919 to Jan. 1920', 'The Palmer Raids: federal agents arrest thousands of suspected radicals, many of them immigrants.'],
        ['1920–1921', 'A sharp postwar depression: wages fall and more than 20,000 businesses fail.'],
        ['Nov. 2, 1920', 'Harding wins the presidency in a landslide.'],
      ] },
      background: [
        'The First Red Scare grew out of the 1917 Russian Revolution, wartime pressure for loyalty, and a wave of bombings in 1919. Attorney General Palmer responded with raids that swept up thousands of people. Many were held without proper legal process, and some were deported.',
        'At the same time, President Wilson refused to compromise with Senate Republicans over the League of Nations. The Senate rejected the treaty in November 1919, the first time it had ever rejected a peace treaty.',
      ],
      tells: 'Fear of radicals, frustration with international commitments and economic pain arrived together. That combination made a promise of calm very attractive in 1920.',
      limits: 'A timeline selects events, and every selection is an interpretation. This one focuses on national politics and leaves out local stories and the people who were arrested.',
      why: 'The fears of 1919 did not end with the election. They shaped immigration laws and free-speech cases later in the decade (see Exhibit 6), which raises the question of whether normalcy protected everyone’s freedom equally.',
      question: 'Which event on this timeline do you think did the most to make “normalcy” appealing? Defend your choice with evidence.',
      sources: ['fbi-palmer', 'senate-versailles', 'ohs-league', 'miller-harding', 'p-palmer'],
    },

    /* ================= EXHIBIT 2 ================= */
    r2_budget: {
      room: 'r2', title: 'The Budget and Accounting Act, 1921', kind: 'Federal law', date: 'Signed June 10, 1921',
      creator: 'U.S. Congress (67th Congress); signed by President Harding', type: 'primary',
      summary: 'The law that gave the United States its first national budget system and an independent auditor of federal spending.',
      images: [
        { src: IMG + 'law_budget_1921.jpg', caption: 'First page of the Budget and Accounting Act as printed in the Statutes at Large, volume 42, page 20.', alt: 'Scanned page of printed federal law with section headings', credit: 'U.S. Government Publishing Office (GovInfo)' },
        { src: IMG + 'dawes.jpg', caption: 'Charles G. Dawes, the first director of the Bureau of the Budget, photographed about 1924.', alt: 'Portrait of Charles Dawes in a suit', credit: 'Library of Congress, LC-USZ6-849' },
      ],
      media: { kind: 'document', heading: 'An Act To provide a national budget system and an independent audit of Government accounts, and for other purposes.', lines: [
        ['Sec. 201', '“The President shall transmit to Congress on the first day of each regular session, the Budget…”'],
        ['Sec. 207', '“There is hereby created in the Treasury Department a Bureau to be known as the Bureau of the Budget.”'],
        ['Sec. 301', '“There is created an establishment of the Government to be known as the General Accounting Office, which shall be independent of the executive departments…”'],
      ], foot: 'Excerpts verified from 42 Stat. 20. The full law is eight pages long.' },
      background: [
        'Before 1921, each federal department sent its own spending requests to Congress. Nobody was responsible for looking at the government’s spending as a whole.',
        'This law required the president to send Congress one complete budget every year, created a Bureau of the Budget inside the Treasury Department to prepare it, and created a General Accounting Office to audit spending independently of the executive departments. Charles G. Dawes, who appears again in Exhibit 5, became the first budget director.',
      ],
      tells: 'Normalcy was not the absence of government action. Harding used federal law to make government more businesslike and economical, borrowing ideas about budgets and audits from the business world.',
      limits: 'A law shows what Congress intended. It does not show how well the new offices worked in practice; for that, a historian would look at budget records and later reports.',
      more: [
        'The office that grew out of the Bureau of the Budget is today’s Office of Management and Budget, and the General Accounting Office still exists as the Government Accountability Office.',
      ],
      why: 'Here business methods were used to protect the public interest: an independent auditor makes it harder to hide waste. Keep that in mind when you reach Teapot Dome in Exhibit 3, where oversight failed until the Senate stepped in.',
      question: 'Why might an independent auditor matter for public trust? Connect your answer to what happens in Exhibit 3.',
      sources: ['stat-budget', 'miller-harding', 'p-dawes'],
    },
    r2_revenue: {
      room: 'r2', title: 'The Revenue Act of 1921', kind: 'Federal law', date: 'Signed November 23, 1921',
      creator: 'U.S. Congress; championed by Treasury Secretary Andrew Mellon', type: 'primary',
      summary: 'The first of the 1920s tax cuts, which lowered wartime income-tax rates and ended a special tax on business profits.',
      images: [
        { src: IMG + 'law_revenue_1921.jpg', caption: 'First page of the Revenue Act of 1921, Statutes at Large, volume 42, page 227.', alt: 'Scanned page of the Revenue Act of 1921', credit: 'U.S. Government Publishing Office (GovInfo)' },
        { src: IMG + 'mellon.jpg', caption: 'Treasury Secretary Andrew Mellon, November 26, 1924.', alt: 'Portrait photograph of Andrew Mellon', credit: 'Library of Congress, LC-G412-T-4559' },
      ],
      media: { kind: 'document', heading: 'An Act To reduce and equalize taxation, to provide revenue, and for other purposes.', lines: [
        ['Title', '“That this Act may be cited as the ‘Revenue Act of 1921.’”'],
        ['Effect', 'Top income-tax rate: 73 percent in 1921, lowered to 58 percent beginning in 1922. The wartime excess-profits tax on businesses was repealed.'],
        ['Later', 'Mellon-backed laws in 1924 and 1926 cut the top rate further, to 25 percent.'],
      ], foot: 'Title and date verified from 42 Stat. 227. Rates summarized from the Cato Journal (a secondary source).' },
      background: [
        'World War I was paid for partly with very high income taxes on the wealthy and a special tax on “excess” business profits. Andrew Mellon, one of the richest men in America, became Treasury Secretary in 1921 and argued that high rates discouraged investment.',
        'The Revenue Act of 1921 began a decade of tax cuts. Under Harding it lowered the top rate and ended the excess-profits tax. Under Coolidge, the Revenue Acts of 1924 and 1926 went further (see Exhibit 4).',
      ],
      tells: 'The title itself is an argument: “to reduce and equalize taxation.” Supporters believed lower rates on high incomes would bring money back into productive investment.',
      limits: 'Two reputable sources read the same facts differently. The Cato Institute argues the cuts encouraged growth and even raised revenue. The Miller Center notes that by 1926 a person earning $1 million paid less than a third of what they paid in 1920, and describes the policy as tax cuts mainly for the rich and corporations. Neither source settles the question alone.',
      why: 'Tax policy is where the relationship between government and business becomes concrete. Who gains from lower rates, and who pays for the services government still provides?',
      question: 'Read both interpretations. What evidence would you need to decide which one is more convincing?',
      sources: ['stat-revenue', 'cato-tax', 'miller-harding', 'treasury-mellon', 'p-mellon'],
    },
    r2_tariff: {
      room: 'r2', title: 'The Fordney-McCumber Tariff, 1922', kind: 'Federal law', date: 'Signed September 21, 1922',
      creator: 'U.S. Congress (sponsored by Rep. Joseph Fordney and Sen. Porter McCumber)', type: 'primary',
      summary: 'A law that raised taxes on imported goods to shield American manufacturers from foreign competition.',
      images: [{ src: IMG + 'law_tariff_1922.jpg', caption: 'Page 858 of Statutes at Large volume 42, where the Tariff Act of 1922 begins (lower part of the page).', alt: 'Scanned page showing the start of the Tariff Act of 1922', credit: 'U.S. Government Publishing Office (GovInfo)' }],
      media: { kind: 'document', heading: 'Tariff Act of 1922, Section 315 (the “flexible tariff”)', lines: [
        ['Sec. 315(a)', '“…in order to regulate the foreign commerce of the United States and to put into force and effect the policy of the Congress by this Act intended, whenever the President, upon investigation of the differences in costs of production… shall find it thereby shown that the duties fixed in this Act do not equalize the said differences in costs of production…”'],
        ['TIME, 1923', 'The president “may raise or lower duties (not more than 50% of the amount fixed by law)” on the Tariff Commission’s recommendation.'],
      ], foot: 'Verified from 42 Stat. 858 and TIME, April 28, 1923. The Section 315 quotation is an excerpt of one long sentence.' },
      background: [
        'A tariff is a tax on imported goods. Higher tariffs make foreign products more expensive, which protects American manufacturers from competition. Harding promised higher tariffs during the 1920 campaign, and this law reversed the lower rates of the Wilson years.',
        'Its “flexible” Section 315 let the president raise or lower individual rates by up to half, after the Tariff Commission compared the cost of making a product at home and abroad. A 1923 TIME article warned that this gave the president more power over tariffs than Congress may have intended.',
      ],
      tells: 'Congress justified protection with a “scientific” idea: a tariff should equalize production costs. In practice, the law served manufacturers who wanted shelter from cheaper imports.',
      limits: 'The statute shows the rules, not their effects. To judge the tariff, a historian would study prices, trade figures and how often presidents actually used the flexible provision.',
      more: [
        'Higher American tariffs also made it harder for European countries to sell goods in the United States and earn the dollars they needed to repay their war debts. Exhibit 5 follows that money trail.',
      ],
      why: 'The tariff is a clear case of government choosing to help one group, manufacturers and their workers, while consumers paid higher prices. Was that in the public interest? People in 1922 disagreed.',
      question: 'Who gains and who loses when a tariff rises? List one winner and one loser, and explain.',
      thinking: 'Winners: protected manufacturers and their workers. Losers: consumers who pay higher prices, farmers who sold crops abroad, and foreign countries trying to earn dollars.',
      sources: ['stat-tariff', 'time-1923', 'miller-harding'],
    },
    r2_harding: {
      room: 'r2', title: 'President Warren G. Harding, 1921–1923', kind: 'Photographs', date: '1921–1923',
      creator: 'Library of Congress Prints and Photographs Division (National Photo Company and others)', type: 'primary',
      summary: 'Three photographs of Harding as president: a formal portrait, his cabinet, and his inauguration.',
      images: [
        { src: IMG + 'harding.jpg', caption: 'Warren G. Harding, between 1921 and 1923.', alt: 'Close portrait of Warren Harding', credit: 'Library of Congress, LC-USZ62-29218' },
        { src: IMG + 'cabinet.jpg', caption: 'President Harding and his cabinet outside the White House, 1921. National Photo Company.', alt: 'Two rows of men in suits posed on the White House lawn', credit: 'Library of Congress, LC-DIG-npcc-03671' },
        { src: IMG + 'harding_inaug.jpg', caption: 'Harding’s inauguration at the U.S. Capitol, March 4, 1921 (panoramic photograph).', alt: 'Wide panoramic view of a crowd in front of the Capitol', credit: 'Library of Congress, LC-USZ62-122406' },
      ],
      background: [
        'Harding’s cabinet mixed widely respected figures, such as Charles Evans Hughes at State, Andrew Mellon at Treasury and Herbert Hoover at Commerce, with friends from Ohio. Several members of that “Ohio Gang” were later charged with defrauding the government.',
        'Harding also made choices that cut against the Red Scare. In December 1921 he commuted the prison sentence of socialist leader Eugene V. Debs. In October 1921, speaking in Birmingham, Alabama, he publicly criticized the unfair treatment of Black Americans, which was unusual for a president at the time.',
        'Harding died suddenly in San Francisco on August 2, 1923, during a speaking tour.',
      ],
      tells: 'The cabinet photograph is a reminder that a president governs through the people he appoints. Some of the men in that picture served the public well; at least one, Albert Fall, betrayed it.',
      limits: 'Official portraits are posed to project authority. They tell us how the administration wanted to be seen, not how it worked behind closed doors.',
      why: 'Harding’s reputation is complicated. Historians have long ranked him poorly because of the scandals among his appointees, while others point to his budget reform, his release of Debs and his civil-rights speech.',
      question: 'Is it fair to judge a president by the actions of the people he appointed? Why or why not?',
      sources: ['p-harding', 'p-cabinet', 'p-inaug', 'miller-harding'],
    },
    r2_wall: {
      room: 'r2', title: 'Business and Labor: Two Views of Normalcy', kind: 'Photographs (comparison wall)', date: '1922 and about 1927',
      creator: 'Library of Congress photographs; interpretations from the Miller Center and the Dictionary of American History', type: 'primary',
      summary: 'Two photographs placed side by side: the industrial boom, and armed guards during the 1922 railroad strike.',
      media: { kind: 'compare', left: { src: IMG + 'river_rouge.jpg', title: 'Industry booms', caption: 'Ford Motor Company’s River Rouge plant, Dearborn, Michigan, about 1927. Detroit Publishing Company.' }, right: { src: IMG + 'rail_strike.jpg', title: 'Labor pushes back', caption: 'Guards on duty during the railroad strike, August 10, 1922.' } },
      background: [
        'Mass production made the 1920s boom possible. Huge plants like Ford’s River Rouge turned out cars that ordinary families could afford, and new industries grew up around the automobile.',
        'Labor saw a different side of the decade. On July 1, 1922, railroad shop workers belonging to unions with about 400,000 members walked off the job after unfavorable rulings by the federal Railroad Labor Board. Attorney General Harry Daugherty obtained what one reference work calls “a sweeping injunction against the strikers and their leadership.” The strike was settled in October 1922, largely in favor of the railroads.',
      ],
      tells: 'Placed together, the photographs show two faces of the same economy: enormous productive power, and conflict over who would share its rewards.',
      limits: 'Each photograph was chosen by a photographer with a purpose. Neither shows wages, hours, or what workers and owners actually said.',
      why: 'For business leaders, normalcy meant stable government, low taxes and order. For many workers, it meant courts and federal officials siding with employers. The relationship between government and business looked very different depending on where you stood.',
      question: 'Compare the two photographs. What does each suggest about whom government served in the early 1920s? What can a photograph not tell you?',
      sources: ['p-rouge', 'p-rail', 'dah-rail', 'miller-harding'],
    },

    /* ================= EXHIBIT 3 ================= */
    r3_board: {
      room: 'r3', title: 'The Evidence Board', kind: 'Investigation board', date: 'Covers 1912–1929',
      creator: 'Assembled by the museum team from primary and secondary sources', type: 'secondary',
      summary: 'Six pinned case files that trace the oil leases from the Navy’s reserves to a cabinet officer’s conviction.',
      media: { kind: 'board', items: [
        { t: 'Timeline: the transfer', type: 'secondary', d: 'The Navy’s oil reserves at Elk Hills, California, and Teapot Dome, Wyoming, were set aside before World War I as emergency fuel for warships. In 1921, an executive order by President Harding transferred control of the reserves from the Navy Department to the Interior Department, headed by Albert B. Fall.', src: 'miller-harding' },
        { t: 'The leases', type: 'secondary', d: 'In 1922, Fall leased Teapot Dome to Harry Sinclair’s Mammoth Oil Company and Elk Hills to Edward Doheny’s Pan American Petroleum. According to the U.S. Senate, the Teapot Dome lease was made “without competitive bidding.”', src: 'senate-td' },
        { t: 'Senate investigation', type: 'secondary', d: 'On April 14, 1922, the Wall Street Journal reported the secret Teapot Dome lease. The next day, Wyoming senator John Kendrick introduced a resolution that began “one of the most significant investigations in Senate history.” Montana senator Thomas Walsh led the inquiry.', src: 'senate-td', img: IMG + 'senate_oil.jpg' },
        { t: 'Newspaper, Jan. 25, 1924', type: 'primary', d: 'Washington’s Evening Star headline: “SINCLAIR MADE FALL $25,000 LOAN, PROBE REVEALS.” Newspapers across the country followed every twist of the hearings. The full page is on the typewriter desk.', src: 'star-1924a', img: IMG + 'news_star_1924_01_25.jpg' },
        { t: 'Profile: Albert B. Fall', type: 'primary', d: 'A former New Mexico senator, Fall served as Interior Secretary from 1921 to 1923. Walsh’s central question was how Fall had grown rich so quickly. Investigators found a $100,000 “loan” from Doheny. Fall was convicted of accepting a bribe on October 25, 1929, and sentenced to one year in prison and a $100,000 fine.', src: 'history-fall', img: IMG + 'fall.jpg' },
        { t: 'Diagram: the connection', type: 'secondary', d: 'Public resource (the Navy’s oil), then government authority (the Interior Secretary’s leases), then private interests (Sinclair and Doheny), then money flowing back to the official. When public power is traded for private payment, that is corruption.', src: 'senate-td' },
      ] },
      background: [
        'Click each pinned note to read it. Notice the labels: primary sources were created at the time; secondary sources explain events afterward.',
        'The investigation also changed constitutional law. In McGrain v. Daugherty (1927), the Supreme Court explicitly confirmed Congress’s right to compel witnesses to testify before its committees.',
      ],
      tells: 'Read in order, the notes show a chain of decisions: a transfer of authority, secret leases, money, a news story and a Senate inquiry. Each link is documented separately.',
      limits: 'An evidence board is a summary. It compresses years of testimony and several trials into six notes, so it cannot show every disputed detail.',
      why: 'Teapot Dome is the sharpest test of the relationship between government, business and the public interest in the 1920s. Public property was handed to private companies in secret, and only a free press and a determined Senate brought it to light.',
      question: 'Which institutions (the press, Congress, the courts) did the most to expose the scandal? Which do you think matters most today?',
      sources: ['senate-td', 'miller-harding', 'history-fall', 'star-1924a', 'p-fall', 'p-senateoil'],
    },
    r3_senate: {
      room: 'r3', title: '“The Senate Discusses the Oil Scandal”', kind: 'Illustration published in 1924', date: '1924',
      creator: 'Gluyas Williams, illustrator', type: 'primary',
      summary: 'A crowded, comic drawing of senators all talking at once, with Senators Walsh and Lenroot in front.',
      images: [{ src: IMG + 'senate_oil.jpg', caption: 'Gluyas Williams, “The Senate discusses the oil scandal (Senators Walsh and Lenroot, who know most about it, in the foreground),” published 1924.', alt: 'Black and white drawing of dozens of senators with open mouths, crowded together', credit: 'Library of Congress, LC-USZ62-100717' }],
      background: [
        'Senator Thomas Walsh, a Montana Democrat, led the investigation for the Senate Committee on Public Lands. Senator Irvine Lenroot of Wisconsin, a Republican, also sat on the committee. The Senate’s own history notes that Republican leaders let Walsh, the most junior minority member, lead the inquiry because they expected it to go nowhere.',
        'By early 1924 the hearings had become front-page news, and senators of both parties were rushing to comment.',
      ],
      tells: 'The cartoonist pokes fun at the noise: everyone is talking, and only the two men in front actually know the facts. It captures how a once-ignored inquiry became a national obsession.',
      limits: 'This is a humorous drawing, not a record of a real session. It shows how one artist and his readers saw the Senate, which makes it evidence of opinion rather than of events.',
      why: 'The drawing reminds us that accountability is messy. Congress exposed the scandal, but it did so in a loud, partisan arena.',
      question: 'What is the artist’s attitude toward the Senate? Find two details in the drawing that support your answer.',
      sources: ['p-senateoil', 'senate-td'],
    },
    r3_map: {
      room: 'r3', title: 'Map: The Naval Oil Reserves', kind: 'Illustrated map and modern photograph', date: 'Reserves set aside 1912–1915; photograph 2016',
      creator: 'Map drawn for this museum. Photograph by Carol M. Highsmith.', type: 'illustration',
      summary: 'A simplified map locating Teapot Dome in Wyoming and Elk Hills in California, with a photograph of the rock that gave Teapot Dome its name.',
      media: { kind: 'map' },
      images: [{ src: IMG + 'teapot_rock.jpg', caption: 'Teapot Rock, Natrona County, Wyoming. Photograph by Carol M. Highsmith, May 29, 2016. This is a modern photograph, not a 1920s one.', alt: 'A tall weathered rock formation on a grassy hill under a blue sky', credit: 'Library of Congress, LC-DIG-highsm-38168' }],
      background: [
        'In the early 1900s the U.S. Navy was switching its warships from coal to oil. To make sure the fleet would never run short in a war, the government set aside oil-rich public lands as Naval Petroleum Reserves, including Elk Hills in California and Teapot Dome in Wyoming.',
        'Oil left underground was a strategic resource: unused today, but available in an emergency. Leasing it to private companies meant someone would profit now.',
      ],
      tells: 'The distance between the two reserves shows that the scandal was not a local matter. Both fields belonged to the whole nation.',
      limits: 'The map is a simplified modern drawing and is not to scale. The photograph shows the landscape today, not the oil field in 1922.',
      why: 'This is a scarce-resource question. Should public resources be saved for national needs, or developed by private businesses for profit and jobs? Either answer can be defended, but the decision must be made openly and fairly, not in secret.',
      question: 'If you were in charge of the reserves, would you lease them? What rules would you require to keep the process honest?',
      sources: ['senate-td', 'miller-harding', 'p-teapot'],
    },
    r3_newspaper: {
      room: 'r3', title: 'Front Page: “Sinclair Made Fall $25,000 Loan”', kind: 'Newspaper front page', date: 'January 25, 1924',
      creator: 'Evening Star (Washington, D.C.)', type: 'primary',
      summary: 'The capital’s evening paper reports new testimony about money moving from an oilman to the former Interior Secretary.',
      media: { kind: 'newspaper', src: IMG + 'news_star_1924_01_25.jpg', caption: 'Evening Star, January 25, 1924, page 1. Note the political cartoon in the center and the column “Former Secretary Is Silent as to Leases.”' },
      background: [
        'By January 1924 the Senate hearings were front-page news. Witnesses revealed money flowing from oilmen to Fall, and Fall refused to explain it.',
        'Newspapers were the main way the public learned about the scandal. Some reporting was careful and some was sensational, which is why historians compare several papers and check them against official records.',
      ],
      tells: 'The page shows what Washington readers learned that evening and how prominently the paper played the story: the largest headline on the page.',
      limits: 'A headline reports what was alleged or revealed that day. It is not, by itself, proof that every claim was true.',
      why: 'This page captures the moment public trust began to crack. It also shows the press doing its job as a check on government.',
      question: 'What is the difference between “the newspaper reported X” and “X happened”? How would you confirm this headline?',
      thinking: 'Check it against Senate hearing records, court records and other newspapers. A headline shows what was reported at a particular moment.',
      sources: ['star-1924a', 'senate-td'],
    },
    r3_fall: {
      room: 'r3', title: 'The Oilmen: Sinclair and Doheny', kind: 'Photographs', date: '1924',
      creator: 'Harris & Ewing and other photographers. Library of Congress.', type: 'primary',
      summary: 'Press photographs of the two oil executives, each with his lawyer, taken during the 1924 investigation.',
      images: [
        { src: IMG + 'sinclair.jpg', caption: 'Harry F. Sinclair (left) with his lawyer Martin W. Littleton at the Teapot Dome hearing, 1924. Harris & Ewing.', alt: 'Two men in suits seated in a crowded hearing room', credit: 'Library of Congress, LC-DIG-hec-44031' },
        { src: IMG + 'doheny.jpg', caption: 'Edward L. Doheny (left) and his lawyer Frank J. Hogan, February 1, 1924.', alt: 'Two older men in overcoats and hats standing outdoors', credit: 'Library of Congress, LC-USZ62-51321' },
      ],
      background: [
        'Edward Doheny, head of Pan American Petroleum, gave Fall $100,000, which both men called a “loan,” and received the Elk Hills lease. Harry Sinclair, head of Mammoth Oil, received the Teapot Dome lease; his interests also passed bonds and cash to Fall.',
        'In 1927 the Supreme Court cancelled the leases and returned the oil fields to the government. Fall was convicted in 1929 of accepting a bribe from Doheny, but Doheny was acquitted of giving it in 1930. Sinclair served time for contempt, including refusing to answer the Senate’s questions.',
      ],
      tells: 'Both men appear with their lawyers, which says a lot: by 1924 this was a legal battle as much as a political one.',
      limits: 'A press photo shows appearance, not guilt or innocence. The verdicts came years later and did not match neatly.',
      why: 'Corruption needs two sides: officials willing to sell public power, and private interests willing to pay. The uneven verdicts show how hard it can be to prove bribery in court.',
      question: 'Why might it be harder to convict the person who pays a bribe than the official who accepts it?',
      sources: ['p-sinclair', 'p-doheny', 'history-fall', 'senate-td'],
    },
    r3_other: {
      room: 'r3', title: 'Filing Cabinet: Other Harding-Era Scandals', kind: 'Museum summary', date: '1921–1924',
      creator: 'Museum team, based on the Miller Center and the U.S. Senate', type: 'secondary',
      summary: 'A short file that separates Teapot Dome from the other scandals of the Harding years.',
      images: [{ src: IMG + 'cabinet.jpg', caption: 'President Harding and his cabinet, 1921. Albert Fall and Harry Daugherty both served in this cabinet. National Photo Company.', alt: 'Two rows of men in suits posed on the White House lawn', credit: 'Library of Congress, LC-DIG-npcc-03671' }],
      media: { kind: 'timeline', items: [
        ['Veterans Bureau', 'Director Charles Forbes diverted supplies from veterans’ hospitals and took payoffs from contractors. He served two years in prison.'],
        ['The “Ohio Gang”', 'Harding’s political friends from Ohio; several were later charged with defrauding the government.'],
        ['Attorney General', 'Harry Daugherty survived impeachment attempts and two indictments involving seized German property. He was never convicted.'],
        ['Teapot Dome', 'Interior Secretary Fall: secret oil leases and bribes. A separate case from the ones above.'],
        ['Harding himself', 'Died August 2, 1923. No evidence shows he personally took oil bribes; much of the corruption came to light after his death.'],
      ] },
      background: [
        'Teapot Dome was the most famous scandal of the Harding years, but it was not the only one. Keeping them separate helps us avoid blaming one person for everything, and also avoid excusing everyone.',
      ],
      tells: 'Corruption was spread across several agencies, which suggests a problem with appointments and oversight, not just one bad actor.',
      limits: 'Whether Harding knew more than he admitted is still debated. The evidence supports “corruption in his administration,” not “Harding took bribes.”',
      why: 'Accurate history depends on precise claims. Learning to tell the difference is the core skill of this exhibit.',
      question: 'Write one sentence about Harding and Teapot Dome that is fully supported by the evidence.',
      thinking: 'For example: “Corruption occurred within Harding’s administration, most famously by Interior Secretary Albert Fall, but there is no evidence Harding personally received oil bribes.”',
      sources: ['miller-harding', 'senate-td', 'p-cabinet'],
    },

    /* ================= EXHIBIT 4 ================= */
    r4_portrait: {
      room: 'r4', title: 'Calvin Coolidge: The Quiet President', kind: 'Photographs and speeches', date: 'Photographs 1923–1925; speeches 1925',
      creator: 'Library of Congress photographs; Calvin Coolidge (speeches)', type: 'primary',
      summary: 'Portraits of Coolidge, a well-known composite image of his first oath of office, and two of his best-known statements.',
      images: [
        { src: IMG + 'coolidge.jpg', caption: 'Calvin Coolidge, about December 4, 1923.', alt: 'Portrait of Calvin Coolidge', credit: 'Library of Congress, LC-USZ62-13030' },
        { src: IMG + 'plymouth_oath.jpg', caption: 'A composite photograph made about 1925 recreating Coolidge’s oath of office in his father’s farmhouse at Plymouth, Vermont, on August 3, 1923. “Composite” means it was assembled afterward, not taken that night.', alt: 'Staged scene of Coolidge taking an oath by lamplight from his father in a farmhouse parlor', credit: 'Library of Congress, LC-USZ62-7885' },
        { src: IMG + 'coolidge_radio.jpg', caption: 'Coolidge addressing radio representatives at the White House, October 8, 1924. National Photo Company.', alt: 'Coolidge speaking to a group of men standing on the White House grounds', credit: 'Library of Congress, LC-DIG-npcc-26256' },
      ],
      excerpt: { text: '“After all, the chief business of the American people is business. They are profoundly concerned with producing, buying, selling, investing and prospering in the world.”', by: 'Calvin Coolidge, Address to the American Society of Newspaper Editors, January 17, 1925', second: { text: '“I favor the policy of economy, not because I wish to save money, but because I wish to save people. The men and women of this country who toil are the ones who bear the cost of the Government.”', by: 'Calvin Coolidge, Inaugural Address, March 4, 1925' } },
      background: [
        'Coolidge was vice president when Harding died. In the early hours of August 3, 1923, his father, a notary public, swore him in at the family farmhouse in Vermont. He won a full term in 1924 and chose not to run again in 1928.',
        'The nickname “Silent Cal” is misleading. According to the Miller Center, he held 520 press conferences, nearly eight a month, and spoke on the radio at least monthly. His 1925 inauguration was the first broadcast nationally by radio.',
      ],
      tells: 'The quotations show a consistent philosophy: a prosperous business economy and a frugal government are good for ordinary people. The farmhouse oath, retold again and again, helped build an image of plain, honest leadership after the Harding scandals.',
      limits: 'Speeches and staged images are carefully managed. The composite photograph in particular is a later re-creation, so it tells us more about Coolidge’s public image than about the scene itself. His famous business line is also often misquoted as “the business of America is business.”',
      why: 'Coolidge stated the decade’s answer to the business question more plainly than anyone: what is good for business is good for the nation. The other displays in this room test that claim.',
      question: 'Coolidge said economy (low spending) would “save people.” Who might agree with him? Who might disagree?',
      sources: ['p-coolidge', 'p-plymouth', 'p-radio', 'apus-asne', 'miller-inaug25', 'miller-coolidge', 'house-inaug25'],
    },
    r4_star: {
      room: 'r4', title: 'Front Page: Coolidge Responds to the Oil Scandal', kind: 'Newspaper front page', date: 'February 13, 1924',
      creator: 'Evening Star (Washington, D.C.)', type: 'primary',
      summary: 'A front page reporting the new president’s promise to prosecute wrongdoing, with a cartoon about his reputation for silence.',
      media: { kind: 'newspaper', src: IMG + 'news_star_1924_02_13.jpg', caption: 'Evening Star, February 13, 1924, page 1. Headlines include “President Pledges Stern Action in Pursuit of Guilty” and “Special Oil Counsel Change Apparent as Confirmation Lags.” The cartoon labels the president “Silent Cal.”' },
      background: [
        'When the Teapot Dome revelations exploded in early 1924, Coolidge, now president and facing an election, promised to prosecute wrongdoing and appointed special counsel to handle the oil cases.',
        'The cartoon shows Uncle Sam reading “Coolidge’s Lincoln Day Speech,” captioned “And they called him ‘Silent Cal.’” Even his nickname was part of the political conversation.',
      ],
      tells: 'The page shows Coolidge separating himself from the scandal. The right-hand column also shows the fight in the Senate over who would serve as special counsel.',
      limits: 'A single day’s paper captures promises, not results. To judge Coolidge’s response, you would follow the prosecutions through 1929.',
      why: 'How leaders respond to corruption shapes public trust as much as the corruption itself. Coolidge’s response helped him win in 1924.',
      question: 'Zoom in on the left column. What did Coolidge promise? Why would that matter in an election year?',
      sources: ['star-1924b', 'miller-coolidge'],
    },
    r4_tax: {
      room: 'r4', title: 'Signing the “Mellon Tax Bill,” 1926', kind: 'Photograph', date: 'February 26, 1926',
      creator: 'Library of Congress Prints and Photographs Division', type: 'primary',
      summary: 'Coolidge seated at a desk signing the Revenue Act of 1926 while Treasury officials look on.',
      images: [
        { src: IMG + 'coolidge_taxbill.jpg', caption: 'Coolidge signing the income tax bill known as the Mellon tax bill, February 26, 1926. Treasury Secretary Andrew Mellon is the third figure from the right.', alt: 'Coolidge seated at a desk signing a document while men in suits stand behind him', credit: 'Library of Congress, LC-USZ62-110627' },
        { src: IMG + 'mellon.jpg', caption: 'Andrew Mellon, November 26, 1924.', alt: 'Portrait photograph of Andrew Mellon', credit: 'Library of Congress, LC-G412-T-4559' },
      ],
      background: [
        'Andrew Mellon served as Treasury Secretary from 1921 to 1932 under three presidents. He believed lower tax rates on high incomes would encourage investment.',
        'The Revenue Act of 1926 cut the top income-tax rate to 25 percent and also reduced estate (inheritance) and gift taxes. At the same time, Coolidge ran budget surpluses: the federal debt fell from about $25.5 billion in 1919 to about $16.9 billion in 1929.',
      ],
      tells: 'A signing ceremony is a statement of priorities. The photograph puts tax policy at the center of the administration’s identity.',
      limits: 'The photo shows the moment of signing, not the law’s effects. Supporters and critics still argue about who benefited most.',
      why: 'Supporters saw a frugal government paying its bills during a boom. Critics argued that the biggest benefits went to the wealthy, and some historians argue these policies fed speculation.',
      question: 'Is paying down the national debt during good times wise policy? What are the trade-offs?',
      sources: ['p-taxbill', 'p-mellon', 'treasury-mellon', 'cato-tax', 'fiscal-debt', 'miller-coolidge'],
    },
    r4_farm: {
      room: 'r4', title: 'The Federal Budget and the American Farmer', kind: 'Photograph and comparison display', date: '1924–1928',
      creator: 'Library of Congress photograph; comparison display written by the museum team', type: 'primary',
      summary: 'A delegation of western farmers visits the White House, paired with a display comparing the decade’s budget priorities.',
      media: { kind: 'priorities' },
      images: [{ src: IMG + 'coolidge_farmers.jpg', caption: 'Coolidge on the White House lawn with members of the House Agricultural Committee and a group of western farmers, January 12, 1924.', alt: 'A long row of men in overcoats standing on a lawn in front of the White House', credit: 'Library of Congress, LC-USZ62-110626' }],
      background: [
        'Farmers expanded production during World War I to feed Europe. When the war ended, demand and prices fell, and farm hardship continued through the 1920s even as cities boomed.',
        'Congress twice passed the McNary-Haugen bill, which would have had a government corporation buy surplus crops at set prices. Coolidge vetoed both versions, in 1927 and 1928, arguing that the plan was costly and would encourage overproduction.',
      ],
      tells: 'Farmers traveled to Washington to make their case in person, which shows how seriously they took federal policy.',
      limits: 'The photograph records a visit, not its outcome. The comparison display summarizes arguments and does not invent statistics.',
      why: 'Every budget is a statement of priorities. Tax cuts, debt reduction and farm relief competed for the same limited dollars, and the choices made helped some Americans far more than others.',
      question: 'Use the comparison display. Which priority did the Coolidge administration choose most often? Who paid the cost of that choice?',
      sources: ['p-farmers', 'miller-coolidge', 'fiscal-debt'],
    },
    r4_ticker: {
      room: 'r4', title: 'The Stock Ticker: Boom and Overconfidence', kind: 'Museum timeline with an archival photograph', date: '1924–1929',
      creator: 'Museum team, based on the Miller Center and ushistory.org', type: 'secondary',
      summary: 'A short timeline of the boom and its weak spots, beside a view of one of the decade’s great factories.',
      images: [{ src: IMG + 'river_rouge.jpg', caption: 'Ford Motor Company’s River Rouge plant, Dearborn, Michigan, about 1927. Detroit Publishing Company.', alt: 'Aerial view of a sprawling factory complex with smokestacks and rail lines', credit: 'Library of Congress, LC-DIG-det-4a25915' }],
      media: { kind: 'timeline', items: [
        ['Mass production', 'Cars, radios and appliances poured out of factories; national brands and advertising spread.'],
        ['Buying on credit', 'Installment plans let families buy now and pay later, expanding both sales and household debt.'],
        ['Buying on margin', 'Investors borrowed money to buy stocks, betting that prices would keep rising.'],
        ['Uneven gains', 'Farmers and workers in older industries shared little of the boom.'],
        ['March 1929', 'Coolidge leaves office; Herbert Hoover becomes president.'],
        ['October 1929', 'The stock market crashes, seven months after Coolidge’s presidency ended.'],
      ] },
      background: [
        'The 1920s economy grew rapidly, and many observers at the time credited “Coolidge Prosperity.” Rising stock prices made speculation seem safe.',
      ],
      tells: 'The timeline shows how credit tied ordinary households and investors to the boom. When prices fell, the debts remained.',
      limits: 'Historians disagree about causes. The Miller Center argues that Coolidge’s fiscal policy encouraged speculation and his light regulation let margin trading flourish. Others emphasize Federal Reserve decisions, global debt problems (Exhibit 5) and bank failures. The Depression had many causes.',
      why: 'Coolidge’s policies did not single-handedly cause the Depression, but the weaknesses of the 1920s help explain why the crash hit so hard.',
      question: 'Why do historians disagree about the causes of the Great Depression? Name two factors from this museum.',
      sources: ['miller-coolidge', 'ushistory-46', 'ohs-dawes', 'p-rouge'],
    },

    /* ================= EXHIBIT 5 ================= */
    r5_flow: {
      room: 'r5', title: 'The Great Map: Following the Money', kind: 'Museum diagram', date: 'Shows 1924–1928',
      creator: 'Drawn for this museum, based on the U.S. Office of the Historian', type: 'secondary',
      summary: 'A diagram of the circle of loans, reparations and war-debt payments that connected the United States and Europe.',
      media: { kind: 'diagram' },
      background: [
        'During the war, the United States lent the Allies more than $10 billion. In 1921, the Reparation Commission set Germany’s bill at 132 billion gold marks, about $31.5 billion.',
        'The United States insisted on being repaid and refused to link war debts to reparations. In the Office of the Historian’s words: “Time and again, Washington rejected calls to cancel these debts.”',
        'After the Dawes Plan of 1924, U.S. banks lent to Germany for about four years. Germany paid reparations to France and Britain, which used the money to pay their war debts to the United States.',
      ],
      tells: 'The diagram shows that the system was a circle with one weak point: it depended on American private lending to keep turning.',
      limits: 'This is a simplified model. Real flows also involved trade, tariffs, gold and central banks.',
      why: 'After U.S. bank loans dried up in 1928, Germany’s economy floundered, which shows how deeply America was tied to Europe even while staying out of the League of Nations.',
      question: 'Trace the circle with your finger. Where does the money start, and where does it end up?',
      sources: ['ohs-dawes'],
    },
    r5_dawes: {
      room: 'r5', title: 'The Dawes Plan, 1924', kind: 'Photograph', date: 'Plan proposed April 1924; photograph about 1924',
      creator: 'Committee chaired by Charles G. Dawes; photograph from the Library of Congress', type: 'primary',
      summary: 'A portrait of the Chicago banker whose committee rescheduled Germany’s reparations.',
      images: [{ src: IMG + 'dawes.jpg', caption: 'Charles G. Dawes, about 1924.', alt: 'Portrait of Charles Dawes in a suit and tie', credit: 'Library of Congress, LC-USZ6-849' }],
      background: [
        'In January 1923 Germany defaulted on a reparation payment. France and Belgium occupied the Ruhr, Germany’s industrial heartland. German workers resisted, inflation became hyperinflation, and the German currency collapsed.',
        'A committee led by Charles G. Dawes proposed a plan in April 1924. Germany’s yearly payments were reduced and would rise as its economy improved; Germany adopted a new currency, the Reichsmark; France and Belgium would leave the Ruhr; and foreign banks would lend Germany $200 million. J.P. Morgan floated the loan in the United States, where investors quickly oversubscribed it.',
        'Dawes shared the 1925 Nobel Peace Prize and became Coolidge’s vice president that same year.',
      ],
      tells: 'The plan calmed a dangerous crisis without the United States joining any alliance. American influence ran through bankers and experts rather than treaties.',
      limits: 'The plan never set Germany’s total bill, and it relied on private loans. When lending stopped, the problem returned. The 1929 Young Plan cut reparations again before the Depression undermined it.',
      why: 'The Dawes Plan shows government and business working together abroad: diplomats set the terms, and private banks supplied the money.',
      question: 'Why might private bank loans be a less reliable foundation for peace than a government treaty?',
      sources: ['ohs-dawes', 'p-dawes'],
    },
    r5_kellogg: {
      room: 'r5', title: 'The Kellogg-Briand Pact, 1928', kind: 'Treaty text and photograph', date: 'Signed August 27, 1928; in force July 24, 1929',
      creator: 'U.S. Secretary of State Frank B. Kellogg and French Foreign Minister Aristide Briand', type: 'primary',
      summary: 'The treaty in which most of the world’s nations promised to renounce war as a tool of national policy.',
      images: [{ src: IMG + 'kellogg_pact.jpg', caption: 'Former President Coolidge, President Herbert Hoover and Frank B. Kellogg with representatives of the governments that ratified the treaty, at the White House, July 24, 1929.', alt: 'A group of formally dressed men standing in a long row in an elegant room', credit: 'Library of Congress, LC-USZ62-111722' }],
      media: { kind: 'document', heading: 'General Treaty for Renunciation of War as an Instrument of National Policy', lines: [
        ['Article I', '“The High Contracting Parties solemnly declare in the names of their respective peoples that they condemn recourse to war for the solution of international controversies, and renounce it, as an instrument of national policy in their relations with one another.”'],
        ['Article II', '“The High Contracting Parties agree that the settlement or solution of all disputes or conflicts of whatever nature or of whatever origin they may be, which may arise among them, shall never be sought except by pacific means.”'],
      ], foot: 'Text verified from the Avalon Project, Yale Law School.' },
      background: [
        'Briand first proposed a U.S.–French pact in 1927. Coolidge and Kellogg preferred an agreement open to all nations, so that a two-country pact would not look like an alliance obligating the United States to defend France.',
        'Fifteen nations signed on the first day, including the United States, Britain, France, Germany, Italy and Japan; 47 more joined later. The Senate approved it 85 to 1, with reservations stating that it did not limit U.S. self-defense or require action against violators.',
      ],
      tells: 'The two short articles are the whole promise: no war as policy, and peaceful settlement of disputes. There is no article about what happens to a violator.',
      limits: 'The pact had no enforcement mechanism and never defined “self-defense.” When Japan invaded Manchuria in 1931, no one acted to enforce it.',
      why: 'Agreeing to a principle is not the same as building a way to enforce it. The pact shows the 1920s preference for moral leadership without binding commitments.',
      question: 'Is a promise without enforcement worthless? Make one argument for and one against.',
      sources: ['avalon-kb', 'ohs-kellogg', 'p-kelloggpact'],
    },
    r5_naval: {
      room: 'r5', title: 'The Washington Naval Conference, 1921–1922', kind: 'Photographs', date: 'November 1921 to February 1922',
      creator: 'Harris & Ewing and other photographers. Library of Congress.', type: 'primary',
      summary: 'The conference in session and Secretary of State Hughes signing the resulting treaties.',
      images: [
        { src: IMG + 'naval_conf.jpg', caption: 'The Conference on Limitation of Armaments in session, Washington, D.C., 1921 or 1922. Harris & Ewing.', alt: 'Delegates seated around a large U-shaped table in a grand hall with balconies', credit: 'Library of Congress, LC-DIG-hec-31562' },
        { src: IMG + 'hughes_sign.jpg', caption: 'Secretary of State Charles Evans Hughes signing the treaties that resulted from the conference, February 5, 1922.', alt: 'A man seated at a table signing papers while delegates watch', credit: 'Library of Congress, LC-USZ6-1755' },
      ],
      background: [
        'Under Harding, Secretary of State Charles Evans Hughes invited nine nations to Washington to stop a costly naval arms race. The Five-Power Treaty set a 5:5:3 ratio for battleship tonnage: 500,000 tons each for the United States and Britain, 300,000 for Japan, and 175,000 each for France and Italy. The powers agreed to stop building capital ships and to scrap older vessels.',
        'The Four-Power Treaty replaced the Anglo-Japanese alliance, and the Nine-Power Treaty promised to respect China’s territorial integrity.',
      ],
      tells: 'The photographs show the United States hosting and leading a major international conference, just two years after rejecting the League of Nations.',
      limits: 'The treaties limited battleships but not every type of ship, which led to a cruiser race after 1922. The China treaty had no enforcement mechanism.',
      why: 'Limiting warships also saved money, which fit the decade’s focus on economy. It was American leadership, just not through the League.',
      question: 'How does the Naval Conference challenge the idea that America was “isolationist” in the 1920s?',
      sources: ['ohs-naval', 'p-naval', 'p-hughes'],
    },
    r5_league: {
      room: 'r5', title: 'The Empty Chair: America and the League', kind: 'Museum installation', date: '1919–1920',
      creator: 'Museum team, based on the U.S. Senate and the Office of the Historian', type: 'secondary',
      summary: 'An empty red chair standing for the seat the United States never took at the League of Nations.',
      media: { kind: 'timeline', items: [
        ['Jan. 1919', 'Wilson helps write the League of Nations into the Treaty of Versailles.'],
        ['1919', 'Senator Henry Cabot Lodge’s committee adds reservations to protect U.S. independence of action.'],
        ['Nov. 19, 1919', 'The Senate rejects the treaty, the first time it ever rejected a peace treaty.'],
        ['1920', 'The treaty fails again, and Harding campaigns against “submergence in internationality.”'],
        ['1920s', 'The League meets in Geneva without the United States.'],
      ] },
      background: [
        'Many Americans feared that the League could draw the United States into foreign wars without a vote of Congress. Wilson refused to compromise with the Senate, and the treaty failed.',
        'Harding’s normalcy promised to keep America out of such commitments, but, as this room shows, not out of world affairs altogether.',
      ],
      tells: 'The empty chair stands for a choice: influence through money and treaties, without permanent security commitments.',
      limits: 'This is a symbolic installation made for the museum, not a historical object. Historians still debate whether U.S. absence fatally weakened the League.',
      why: 'Staying out of the League was one of the clearest meanings of “normalcy” in foreign policy.',
      question: 'Was staying out of the League a reasonable response to World War I, or a mistake? Use evidence from this room.',
      sources: ['senate-versailles', 'ohs-league', 'loc-readjust'],
    },

    /* ================= EXHIBIT 6 ================= */
    r6_immig: {
      room: 'r6', title: 'The Immigration Act of 1924', kind: 'Federal law and photograph', date: 'Signed May 26, 1924 (earlier law: May 19, 1921)',
      creator: 'U.S. Congress (Johnson-Reed Act); signed by President Coolidge', type: 'primary',
      summary: 'The law that set national-origins quotas on immigration, shown beside a photograph of immigrants arriving before the quotas existed.',
      images: [
        { src: IMG + 'law_immigration_1924.jpg', caption: 'Page 159 of Statutes at Large volume 43, from the Immigration Act of 1924, including Section 11 on quotas.', alt: 'Scanned page of the Immigration Act of 1924 with numbered sections', credit: 'U.S. Government Publishing Office (GovInfo)' },
        { src: IMG + 'ellis.jpg', caption: 'Immigrants at Ellis Island, between 1907 and 1917, before the quota laws.', alt: 'Immigrants in coats and hats waiting inside an Ellis Island building', credit: 'Library of Congress, LC-USZ62-26543' },
        { src: IMG + 'law_quota_1921.jpg', caption: 'The 1921 quota law (Statutes at Large, volume 42, page 5), the first to use percentage quotas.', alt: 'Scanned first page of the 1921 immigration act', credit: 'U.S. Government Publishing Office (GovInfo)' },
      ],
      media: { kind: 'document', heading: 'Comparing the quota laws', lines: [
        ['1921 law', '“…limited to 3 per centum of the number of foreign-born persons of such nationality resident in the United States as determined by the United States census of 1910.”'],
        ['1924, Sec. 11(a)', '“The annual quota of any nationality shall be 2 per centum of the number of foreign-born individuals of such nationality resident in continental United States as determined by the United States census of 1890…”'],
        ['1924, Sec. 13(c)', '“No alien ineligible to citizenship shall be admitted to the United States…” (with narrow exceptions)'],
      ], foot: 'Wording verified from 42 Stat. 5 and 43 Stat. 153.' },
      background: [
        'Harding called Congress into a special session in 1921, and it passed the first quota law, which limited each nationality to 3 percent of its 1910 population in the United States.',
        'Why did the 1924 law switch to the 1890 census? In 1890, far fewer immigrants from southern and eastern Europe (such as Italy, Poland and Russia) lived in the United States. Using the older census shrank their quotas and favored immigrants from Britain, Ireland, Germany and Scandinavia.',
        'Section 13(c) barred people “ineligible to citizenship.” Because earlier naturalization laws excluded people of Asian descent from citizenship, this effectively ended immigration from Japan. Japan protested, and tensions between the two countries rose. The quotas did not apply to the Western Hemisphere.',
      ],
      tells: 'The law reads like neutral arithmetic, but the choice of census year was the policy. The formula decided in advance which nationalities would be welcome.',
      limits: 'A statute shows the rules. To see the human effects, historians turn to visa records, family letters and immigrant newspapers.',
      more: [
        'The Office of the Historian concludes: “In all of its parts, the most basic purpose of the 1924 Immigration Act was to preserve the ideal of U.S. homogeneity.” Supporters spoke of protecting American jobs and culture; the formula shows whom they meant by “American.”',
      ],
      why: 'Normalcy, for the law’s supporters, meant an America that looked more like it had in 1890. For families in Italy, Poland or Japan, it meant the door was closing. That is the equal-opportunity question at its most direct.',
      question: 'Compare the law’s stated rule (a percentage of a census) with its effect. Why might lawmakers choose a neutral-sounding formula to achieve an unequal result?',
      sources: ['stat-quota21', 'stat-immig24', 'ohs-immig', 'p-ellis'],
    },
    r6_gitlow: {
      room: 'r6', title: 'Gitlow v. New York, 1925', kind: 'Supreme Court opinion', date: 'Decided June 8, 1925',
      creator: 'U.S. Supreme Court. Majority opinion by Justice Edward T. Sanford; dissent by Justice Oliver Wendell Holmes Jr., joined by Justice Louis Brandeis.', type: 'primary',
      summary: 'Pages from the official printed opinion in the case that first treated freedom of speech as protected against state governments.',
      images: [
        { src: IMG + 'gitlow_opinion_p652.jpg', caption: 'First page of Gitlow v. New York as printed in United States Reports, volume 268, page 652.', alt: 'Scanned printed page titled Gitlow v. People of New York', credit: 'Library of Congress, U.S. Reports' },
        { src: IMG + 'gitlow_opinion_p666.jpg', caption: 'Page 666: the passage where the Court assumes that freedom of speech is protected from the states by the Fourteenth Amendment.', alt: 'Scanned page of the Gitlow majority opinion', credit: 'Library of Congress, U.S. Reports' },
        { src: IMG + 'gitlow_dissent_p673.jpg', caption: 'Page 673: Justice Holmes’s dissent, including the line “Every idea is an incitement.”', alt: 'Scanned page of Justice Holmes’s dissenting opinion', credit: 'Library of Congress, U.S. Reports' },
      ],
      media: { kind: 'case', timeline: [
        ['1919', 'Benjamin Gitlow, a leader of the left wing of the Socialist Party, helps publish the “Left Wing Manifesto” in a paper called The Revolutionary Age. Sixteen thousand copies are printed.'],
        ['1919–1920', 'He is convicted under New York’s criminal anarchy law for advocating the overthrow of government by unlawful means.'],
        ['June 8, 1925', 'The Supreme Court upholds his conviction, 7 to 2, but treats free speech as protected against the states.'],
        ['Dec. 1925', 'New York governor Al Smith pardons Gitlow.'],
      ] },
      excerpt: { text: '“For present purposes we may and do assume that freedom of speech and of the press . . . are among the fundamental personal rights and ‘liberties’ protected by the due process clause of the Fourteenth Amendment from impairment by the States.”', by: 'Justice Edward T. Sanford, for the majority. The ellipsis marks an omitted phrase about the First Amendment’s limits on Congress.', second: { text: '“Every idea is an incitement. It offers itself for belief and if believed it is acted on unless some other belief outweighs it or some failure of energy stifles the movement at its birth.”', by: 'Justice Oliver Wendell Holmes Jr., dissenting' } },
      background: [
        'The First Amendment says “Congress shall make no law… abridging the freedom of speech.” For most of American history that limited only the federal government. The Fourteenth Amendment (1868) says no state may deprive any person of liberty “without due process of law.”',
        'Gitlow’s lawyers argued that New York had punished him for words alone, since no violence followed the manifesto. The majority disagreed. It held that a state could punish speech advocating the violent overthrow of government before any action took place. Holmes and Brandeis answered that the manifesto posed no present danger and should have been protected.',
        'At the same time, the Court took a step with long-lasting effects: it treated freedom of speech as one of the “liberties” the Fourteenth Amendment protects from state governments. This idea, called incorporation, later became the basis for applying most of the Bill of Rights to the states.',
      ],
      tells: 'The opinion pages show both sides of the 1920s at once: a Court willing to approve punishment for radical speech, and a Constitution that was quietly expanding.',
      limits: 'The majority only “assumed” the free-speech point “for present purposes,” so the opinion did not settle every question. Later cases built the full doctrine.',
      more: [
        'The American Civil Liberties Union, founded in 1920, calls Gitlow its first Supreme Court landmark. Keep in mind that the ACLU is describing its own history.',
      ],
      why: 'Gitlow lost his case, but the protection for everyone’s speech grew. The case captures the tension between public order and individual freedom that began with the Red Scare in Exhibit 1.',
      question: 'Distinguish the outcome for Gitlow from the case’s constitutional significance. Why can both be true at once?',
      sources: ['usrep-gitlow', 'lii-gitlow', 'aclu'],
    },
    r6_aclu: {
      room: 'r6', title: 'Civil Liberties after the Red Scare', kind: 'Museum timeline with an archival portrait', date: '1919–1925',
      creator: 'Museum team, based on the sources listed below', type: 'secondary',
      summary: 'How the fear of radicals turned into a lasting debate about free speech and due process.',
      images: [{ src: IMG + 'palmer.jpg', caption: 'Attorney General A. Mitchell Palmer, 1919, whose raids prompted many of the civil-liberties campaigns of the 1920s.', alt: 'Portrait of A. Mitchell Palmer', credit: 'Library of Congress, LC-DIG-ds-07209' }],
      media: { kind: 'timeline', items: [
        ['1919–1920', 'Palmer Raids: thousands arrested, many held without proper legal process.'],
        ['1920', 'The American Civil Liberties Union is founded to defend free speech and due process.'],
        ['Dec. 1921', 'Harding commutes the sentence of Eugene V. Debs, imprisoned for opposing the war.'],
        ['1925', 'Gitlow v. New York: free speech applies to the states.'],
      ] },
      background: [
        'The Red Scare forced Americans to ask how much freedom a society should allow when it feels threatened. Supporters of the raids pointed to real bombings; critics pointed to mass arrests of people who had committed no crime.',
        'Organizations like the ACLU argued that defending unpopular speech protects everyone’s rights.',
      ],
      tells: 'Within six years the country moved from mass arrests to a Supreme Court ruling that expanded speech protections, though it still upheld a conviction.',
      limits: 'The ACLU source in our bibliography describes the organization’s own history, so it is not a neutral account.',
      why: 'Normalcy promised order. Civil liberties advocates asked: order at what cost, and for whom?',
      question: 'When, if ever, should government limit speech to protect public safety? Use Gitlow or the Palmer Raids as evidence.',
      sources: ['aclu', 'fbi-palmer', 'miller-harding', 'lii-gitlow', 'p-palmer'],
    },
    r6_unequal: {
      room: 'r6', title: 'Unequal Experiences of Normalcy', kind: 'Museum timeline with an archival photograph', date: '1910–1929',
      creator: 'Museum team; photograph by the American National Red Cross', type: 'secondary',
      summary: 'A timeline of opportunity and violence in the lives of Black Americans, with a Red Cross photograph taken in Tulsa after the 1921 massacre.',
      images: [{ src: IMG + 'tulsa.jpg', caption: 'Ruins in Tulsa, Oklahoma, photographed by the American National Red Cross in June 1921. The original title uses the period term “race riots”; historians now call it the Tulsa Race Massacre.', alt: 'A street lined with burned ruins, bare chimneys and utility poles', credit: 'Library of Congress, LC-DIG-anrc-14737' }],
      media: { kind: 'timeline', items: [
        ['1910–1940', 'The First Great Migration: about 2 million Black Southerners move north and west between the World Wars, seeking jobs and escape from Jim Crow and racial violence.'],
        ['May 31–June 1, 1921', 'Tulsa Race Massacre: a white mob destroys Greenwood, Tulsa’s Black district. More than 1,000 homes and businesses are destroyed; credible death estimates range from 50 to 300.'],
        ['Oct. 1921', 'In Birmingham, Alabama, Harding publicly criticizes the unfair treatment of Black Americans.'],
        ['Jan. 1922', 'The House passes the Dyer Anti-Lynching Bill. Southern senators block it, and it never becomes law.'],
        ['1920s', 'In Northern cities, migrants find new jobs and build cultural movements like the Harlem Renaissance, but they face housing discrimination and segregated neighborhoods.'],
      ] },
      background: [
        'For many Black Americans, the 1920s combined real opportunity with real danger. Northern factory jobs paid more than Southern farm work, and vibrant communities grew in cities like New York, Chicago and Detroit.',
        'At the same time, racial violence, segregation and discrimination limited who could share in the decade’s prosperity and political promises.',
      ],
      tells: 'The Red Cross photograph documents the scale of destruction in Greenwood, which had been one of the largest Black communities in Oklahoma.',
      limits: 'The photograph shows ruins, not the people who lived there or what they lost. Survivors’ testimony and later investigations, including a state commission formed in 1997, fill in that history.',
      why: 'The era was neither universally prosperous nor universally bleak. Comparing experiences shows that “normal” meant very different things depending on race, region and class.',
      question: 'The House passed an anti-lynching bill, but the Senate blocked it. What does this tell you about whose safety national politics protected in the 1920s?',
      sources: ['nara-migration', 'ohs-tulsa', 'naacp-dyer', 'miller-harding', 'p-tulsa'],
    },

    /* ================= TOWN SQUARE ================= */
    town_memorial: {
      room: 'town', title: 'The Doughboy Memorial', kind: 'Memorial (photograph of a real example)', date: 'Wheeling statue dedicated May 30, 1931; photograph 2015',
      creator: 'Sculptor E. M. Viquesney (design); photograph by Carol M. Highsmith', type: 'primary',
      summary: 'The statue in our town square is a pixel-art stand-in. The photograph shows a real one: the “Spirit of the American Doughboy” in Wheeling Park, Wheeling, West Virginia.',
      images: [{ src: IMG + 'doughboy_wheeling.jpg', caption: 'The “Spirit of the American Doughboy” World War I memorial at Wheeling Park, Wheeling, West Virginia. Photograph by Carol M. Highsmith, May 10, 2015.', alt: 'A statue of a World War I soldier holding a rifle and raising a grenade, on a stone base in a wooded park', credit: 'Library of Congress, LC-DIG-highsm-31946' }],
      background: [
        '“Doughboy” was the popular nickname for American infantrymen in World War I. After the war, towns across the country raised memorials to their local soldiers, and many chose a standing doughboy.',
        'Sculptor E. M. Viquesney’s design, the “Spirit of the American Doughboy,” was copied in many towns. Wheeling’s pressed-copper version was dedicated on Memorial Day, May 30, 1931, before a crowd of several thousand.',
      ],
      tells: 'Memorials like this show how communities wanted to remember the war: as service and sacrifice by local men, honored in a public park.',
      limits: 'A memorial records how people chose to remember, not the full experience of the war. Our town’s statue is a modern illustration inspired by these memorials, not a copy of a specific one.',
      why: 'More than four million Americans served in the war. Their return in 1919 is where our story begins, at Union Station, just northwest of here.',
      question: 'Why might communities build memorials soon after a war? What do memorials remember, and what might they leave out?',
      sources: ['p-doughboy', 'ocpl-doughboy'],
    },
  };

  /* -------------------------------------------------------------------
     9. MINI-GAME DATA
     ------------------------------------------------------------------- */
  const GAMES = {};

  GAMES.r1 = {
    title: 'Restore Stability', subtitle: 'A historical simulation. You are a fictional adviser in 1920–1922.',
    intro: 'You will face four problems left over from World War I. Every option has trade-offs. After each choice you will see what the federal government actually did. The two meters are a simplified simulation, not historical measurements.',
    meters: ['Public confidence', 'Fairness to workers and minorities'],
    rounds: [
      { title: 'Economic Uncertainty', when: '1920–1921', prompt: 'The postwar depression has hit. Wages are falling and more than 20,000 businesses have failed. What should the federal government do first?',
        options: [
          { t: 'Cut government spending and taxes to restore business confidence.', pro: 'Signals stability to investors and reduces the wartime tax burden.', con: 'Offers little direct help to the unemployed.', m: [2, -1] },
          { t: 'Launch federal public-works jobs for the unemployed.', pro: 'Puts people to work quickly.', con: 'Costly, and very few leaders in 1921 supported a large federal jobs role.', m: [0, 2] },
          { t: 'Do nothing and let the market correct itself.', pro: 'No new spending.', con: 'Hardship lasts longer with no plan.', m: [-1, -1] },
        ],
        actual: 'Harding relied mainly on economy. The Budget and Accounting Act tightened spending, and the Revenue Act of 1921 began cutting taxes. The depression ended by 1922 and a long boom followed, though historians debate how much policy caused the recovery.', src: 'miller-harding' },
      { title: 'Labor Unrest', when: '1922', prompt: 'About 400,000 railroad shop workers strike after unfavorable rulings by the federal Railroad Labor Board. Trains are disrupted nationwide.',
        options: [
          { t: 'Seek a court injunction to end the strike.', pro: 'Restores rail service quickly.', con: 'Uses federal power against workers and their unions.', m: [1, -2] },
          { t: 'Push both sides into federal mediation.', pro: 'Could produce a fairer settlement.', con: 'Slower, and the railroads may refuse.', m: [1, 1] },
          { t: 'Stay neutral and let the strike play out.', pro: 'Avoids taking sides.', con: 'A long disruption to the economy.', m: [-1, 0] },
        ],
        actual: 'Attorney General Harry Daugherty obtained “a sweeping injunction against the strikers and their leadership.” The strike was settled in October 1922, largely in favor of the railroads. Many workers saw it as proof that normalcy favored employers.', src: 'dah-rail' },
      { title: 'Fear of Radicalism', when: '1919–1921', prompt: 'After the 1919 bombings and the Palmer Raids, socialist leader Eugene V. Debs is still in federal prison for speaking against the war. Some want him freed; others call him dangerous.',
        options: [
          { t: 'Keep Debs in prison to show strength against radicals.', pro: 'Reassures people who fear revolution.', con: 'Punishes political speech and deepens divisions.', m: [0, -2] },
          { t: 'Commute his sentence as a gesture of healing.', pro: 'Signals that the wartime crackdown is over.', con: 'Angers some veterans and patriotic groups.', m: [1, 2] },
          { t: 'Expand raids against suspected radicals.', pro: 'Looks tough on disorder.', con: 'Violates the civil liberties of innocent people.', m: [-1, -3] },
        ],
        actual: 'In December 1921, Harding commuted Debs’s sentence and even invited him to the White House. It was one sign that Harding meant “healing,” not continued crackdowns. Still, fear of radicals shaped immigration and speech laws for years (see Exhibit 6).', src: 'miller-harding' },
      { title: 'America’s Role in the World', when: '1921', prompt: 'The Senate has rejected the Treaty of Versailles and the League of Nations. Meanwhile, Japan, Britain and the United States are racing to build expensive battleships.',
        options: [
          { t: 'Try again to join the League of Nations.', pro: 'Builds collective security.', con: 'The Senate already said no; politically impossible.', m: [-2, 0] },
          { t: 'Host a conference to limit navies by treaty.', pro: 'Saves money and reduces tension without joining the League.', con: 'Treaties may lack enforcement.', m: [2, 0] },
          { t: 'Win the arms race by outbuilding everyone.', pro: 'The strongest navy in the world.', con: 'Enormously expensive, and it raises tensions.', m: [-1, -1] },
        ],
        actual: 'Secretary of State Charles Evans Hughes hosted the Washington Naval Conference (1921–22), which set a 5:5:3 battleship ratio. The United States stayed out of the League but led on disarmament (see Exhibit 5).', src: 'ohs-naval' },
    ],
  };

  GAMES.r2 = {
    title: 'The President’s Policy Desk', subtitle: 'Match each policy to its purpose, the people who carried it out, and the people it affected most.',
    policies: [
      { id: 'budget', name: 'Budget and Accounting Act (1921)', purpose: 'Create one national budget and independent audits of spending', inst: 'Congress passed it; the new Bureau of the Budget and General Accounting Office carried it out', groups: 'Taxpayers and federal agencies', exp: 'Before 1921 there was no single national budget. The act required a presidential budget each year, created the Bureau of the Budget in the Treasury, and created the independent General Accounting Office.', src: 'stat-budget' },
      { id: 'revenue', name: 'Revenue Act of 1921', purpose: 'Cut wartime taxes, especially top rates, to encourage investment', inst: 'Congress, pushed by Treasury Secretary Mellon', groups: 'Wealthy taxpayers and corporations most directly', exp: 'It lowered the top income-tax rate (73% to 58% beginning in 1922) and repealed the excess-profits tax. Mellon argued that lower rates would spur investment; critics said the rich gained most.', src: 'stat-revenue' },
      { id: 'tariff', name: 'Fordney-McCumber Tariff (1922)', purpose: 'Raise taxes on imports to protect American industry', inst: 'Congress; the president could adjust rates on the Tariff Commission’s advice', groups: 'Manufacturers (helped); consumers and foreign exporters (hurt)', exp: 'Higher tariffs reversed the Wilson-era cuts. The “flexible” Section 315 let the president raise or lower rates by up to 50 percent.', src: 'stat-tariff' },
      { id: 'injunction', name: 'Daugherty Injunction (1922)', purpose: 'End the national railroad shop workers’ strike', inst: 'The Attorney General (Justice Department), through a federal court', groups: 'Railroad workers and their unions', exp: 'Attorney General Daugherty secured a sweeping injunction against strikers and their leaders. The settlement largely favored the railroads.', src: 'dah-rail' },
    ],
    quiz: [
      { q: 'Which group most directly benefited from the Fordney-McCumber Tariff?', opts: ['Consumers buying imported goods', 'American manufacturers facing foreign competition', 'European exporters'], a: 1, exp: 'Tariffs raise the price of imports, which protects domestic producers. Consumers and foreign exporters generally lost.', src: 'stat-tariff' },
      { q: 'Before 1921, how did the federal government handle its budget?', opts: ['The president sent one unified budget each year', 'Each agency sent its own requests to Congress', 'The Supreme Court approved all spending'], a: 1, exp: 'There was no central budget. The Budget and Accounting Act gave the president responsibility for a single annual budget.', src: 'miller-harding' },
      { q: 'Which statement best describes the debate over Mellon’s tax cuts?', opts: ['Everyone agreed they only helped the poor', 'Supporters said they spurred investment; critics said they mainly helped the wealthy', 'They raised taxes on businesses'], a: 1, exp: 'The Cato Institute credits the cuts with growth; the Miller Center stresses how much the wealthiest gained. Weighing both views is the point.', src: 'cato-tax' },
    ],
  };

  GAMES.r3 = {
    title: 'Solve the Teapot Dome Case', subtitle: 'An evidence investigation in six steps.',
    timeline: [
      { id: 't1', t: 'Naval oil reserves set aside as emergency fuel for the Navy', d: '1912–1915' },
      { id: 't2', t: 'Harding’s executive order moves the reserves to the Interior Department', d: '1921' },
      { id: 't3', t: 'Fall secretly leases Teapot Dome and Elk Hills without competitive bidding', d: '1922' },
      { id: 't4', t: 'Wall Street Journal report; Senator Kendrick calls for an investigation', d: 'April 1922' },
      { id: 't5', t: 'Harding dies in San Francisco', d: 'August 1923' },
      { id: 't6', t: 'Senate hearings reveal money from the oilmen to Fall', d: '1923–1924' },
      { id: 't7', t: 'Supreme Court cancels the leases; McGrain v. Daugherty confirms Senate subpoena power', d: '1927' },
      { id: 't8', t: 'Fall convicted of accepting a bribe', d: 'October 1929' },
    ],
    suspect: { q: 'Which public official arranged the secret leases?', opts: ['President Warren G. Harding', 'Interior Secretary Albert B. Fall', 'Senator Thomas Walsh', 'Vice President Calvin Coolidge'], a: 1,
      exp: 'Albert B. Fall, as Interior Secretary, signed the leases. Harding transferred control of the reserves to Interior, but there is no evidence he took bribes. Walsh led the investigation that exposed Fall, and Coolidge had no role in the leases.' },
    connect: { q: 'Connect each reserve to the private interest that received its lease.', pairs: [['Teapot Dome, Wyoming', 'Harry Sinclair (Mammoth Oil)'], ['Elk Hills, California', 'Edward Doheny (Pan American Petroleum)']] },
    claims: [
      { t: 'Albert Fall received $100,000 from Edward Doheny.', proven: true, exp: 'Established. Doheny admitted the payment; both men called it a “loan.”' },
      { t: 'The Teapot Dome lease was made without competitive bidding.', proven: true, exp: 'Established by the Senate’s own history of the investigation.' },
      { t: 'President Harding personally accepted oil bribes.', proven: false, exp: 'Not supported. Harding died in 1923, and no evidence shows he took bribes.' },
      { t: 'Fall was convicted of accepting a bribe.', proven: true, exp: 'Established. He was convicted on October 25, 1929.' },
      { t: 'Every member of Harding’s cabinet was corrupt.', proven: false, exp: 'Not supported. Officials such as Hughes, Mellon and Hoover were never implicated in the scandals.' },
      { t: 'Edward Doheny was convicted of bribing Fall.', proven: false, exp: 'False. Doheny was acquitted in 1930, even though Fall was convicted of taking his money.' },
    ],
    senate: { q: 'What was the Senate investigation’s most important role?', opts: ['It wrote the oil leases', 'It exposed the secret deals and the money trail to the public', 'It sentenced Fall to prison'], a: 1,
      exp: 'Congress investigates; courts convict. Walsh’s committee uncovered the evidence, and the 1927 McGrain v. Daugherty decision confirmed Congress’s power to compel testimony.' },
    summary: 'CASE SUMMARY. Public oil reserved for the Navy was leased in secret by Interior Secretary Albert B. Fall to two oilmen who gave him money. A newspaper report and a determined Senate investigation exposed the deals. The Supreme Court cancelled the leases, and Fall became the first former cabinet officer to go to prison. The scandal shook public trust, but it also showed accountability working through a free press, Congress and the courts.',
  };

  GAMES.r4 = {
    title: 'Balancing the Budget', subtitle: 'You are a fictional policy adviser to the Coolidge administration, 1925.',
    budget: 10,
    rules: 'Divide 10 budget points among six priorities. Each point is a simplified unit, not a real dollar amount from Coolidge’s budget. The indicators change according to the fixed rules listed beside each priority.',
    cats: [
      { id: 'tax', name: 'Tax cuts', desc: 'Lower income and estate taxes (the Mellon program).', fx: { business: 2, farm: 0, debt: -1, services: 0 }, helps: 'investors, high earners and businesses', hurts: 'less revenue for other priorities' },
      { id: 'debt', name: 'Pay down the national debt', desc: 'Retire wartime debt using surpluses.', fx: { business: 1, farm: 0, debt: 2, services: 0 }, helps: 'future taxpayers and bond markets', hurts: 'no immediate help for anyone struggling' },
      { id: 'farm', name: 'Farm relief', desc: 'McNary-Haugen-style crop price supports.', fx: { business: 0, farm: 3, debt: -1, services: 0 }, helps: 'farm families facing low prices', hurts: 'taxpayers; critics feared overproduction' },
      { id: 'roads', name: 'Roads and infrastructure', desc: 'Federal aid for highways and waterways.', fx: { business: 1, farm: 1, debt: -1, services: 1 }, helps: 'drivers, rural areas and construction workers', hurts: 'higher spending' },
      { id: 'vets', name: 'Veterans’ bonus', desc: 'Extra compensation for World War I veterans.', fx: { business: 0, farm: 0, debt: -1, services: 2 }, helps: 'veterans and their families', hurts: 'higher spending and debt' },
      { id: 'navy', name: 'Naval and military', desc: 'Ships and defense within treaty limits.', fx: { business: 1, farm: 0, debt: -1, services: 0 }, helps: 'shipbuilders and defense', hurts: 'higher spending' },
    ],
    indicators: { business: 'Business confidence', farm: 'Farm well-being', debt: 'Debt paid down', services: 'Direct public help' },
    actual: 'The real Coolidge administration put tax cuts and debt reduction first. With Mellon, it passed the Revenue Acts of 1924 and 1926, ran surpluses, and cut the debt from about $25.5 billion (1919) to about $16.9 billion (1929). Coolidge vetoed the McNary-Haugen farm bills in 1927 and 1928, and he vetoed a 1924 veterans’ bonus bill, which Congress passed over his veto.',
    srcs: ['miller-coolidge', 'fiscal-debt', 'cato-tax'],
  };

  GAMES.r5 = {
    title: 'Repair the International Economy', subtitle: 'Rebuild the money cycle of the Dawes Plan years (a simplified model).',
    nodes: [
      { id: 'banks', name: 'U.S. Banks', x: 0.17, y: 0.28 },
      { id: 'germany', name: 'Germany', x: 0.82, y: 0.28 },
      { id: 'allies', name: 'Britain & France', x: 0.82, y: 0.76 },
      { id: 'treasury', name: 'U.S. Government', x: 0.17, y: 0.76 },
    ],
    flows: [
      { from: 'banks', to: 'germany', label: 'Private loans', exp: 'After the Dawes Plan (1924), American banks lent heavily to Germany, starting with a $200 million loan floated by J.P. Morgan.' },
      { from: 'germany', to: 'allies', label: 'Reparation payments', exp: 'Germany used much of that borrowed money to pay reparations to France, Britain and other Allies.' },
      { from: 'allies', to: 'treasury', label: 'War-debt repayments', exp: 'The Allies used reparation receipts to repay the more than $10 billion the United States had lent them during the war.' },
    ],
    labels: ['Private loans', 'Reparation payments', 'War-debt repayments'],
    scenario: { title: 'What if? 1928: American lending dries up', prompt: 'The stock market is booming and U.S. banks stop lending to Germany. Which parts of the cycle are affected? Select all that apply.',
      opts: [
        { t: 'Germany has trouble paying reparations', a: true },
        { t: 'Britain and France receive less money', a: true },
        { t: 'War-debt repayments to the United States are threatened', a: true },
        { t: 'Nothing changes, because each payment is independent', a: false },
      ],
      exp: 'Every link depended on the first one. According to the Office of the Historian, after U.S. bank loans dried up in 1928, Germany’s economy floundered. Hoover proposed a one-year moratorium on debts and reparations in 1931, and by mid-1933 every European debtor except Finland had defaulted on its U.S. loans.',
      caveat: 'Simplified model: real international finance involved trade, tariffs, gold and central banks. This puzzle is not a complete explanation of the Great Depression.' },
    kellogg: { q: 'Bonus: the Kellogg-Briand Pact renounced war. What did it lack?', opts: ['Signatures from major powers', 'Any enforcement mechanism or sanctions', 'Approval from the U.S. Senate'], a: 1, exp: 'Fifteen nations signed at first and the Senate approved it 85 to 1, but there were no sanctions and no definition of self-defense. Japan’s 1931 invasion of Manchuria went unpunished.' },
    src: 'ohs-dawes',
  };

  GAMES.r6 = {
    title: 'Who Experienced Normalcy?', subtitle: 'Six historical composites, each built from real laws and events.',
    intro: 'These are not real individuals. Each is a historical composite based on documented conditions of the 1920s. For each person, choose the policy or event that most directly shaped their life. There is no score; the goal is understanding.',
    profiles: [
      { name: 'Walter, 52', role: 'Factory owner, Ohio', look: 'businessman', story: 'Walter runs a mid-sized machine shop. Foreign competitors undercut his prices before the war, and high wartime taxes ate into profits he wanted to reinvest.',
        opts: ['Fordney-McCumber Tariff and Mellon tax cuts', 'Immigration Act of 1924', 'Gitlow v. New York'], a: 0,
        exp: 'Higher tariffs protected Walter’s products from foreign competition, and tax cuts let him keep more profit. For business owners like him, normalcy often meant stability and growth.', src: 'stat-tariff' },
      { name: 'Rosa, 34', role: 'Railroad shop worker’s wife, Illinois', look: 'worker', story: 'Rosa’s husband repairs locomotives. In 1922 his union walked out over wage cuts and working rules, and the family lived on savings for months.',
        opts: ['Kellogg-Briand Pact', 'The 1922 railroad strike and the Daugherty injunction', 'Revenue Act of 1926'], a: 1,
        exp: 'The federal injunction broke the strike, and the settlement largely favored the railroads. For many working families, government power seemed to side with employers.', src: 'dah-rail' },
      { name: 'Emil, 45', role: 'Wheat farmer, North Dakota', look: 'farmer', story: 'Emil borrowed money during the war to buy more land when wheat prices were high. Now prices have fallen, and he struggles to pay his mortgage.',
        opts: ['Coolidge’s vetoes of the McNary-Haugen farm bills', 'The Washington Naval Conference', 'The Budget and Accounting Act'], a: 0,
        exp: 'Congress passed McNary-Haugen twice to support crop prices, and Coolidge vetoed it twice (1927 and 1928). Farm hardship continued through the decade even as cities boomed.', src: 'miller-coolidge' },
      { name: 'Giuseppe, 23', role: 'Hopes to emigrate from Italy', look: 'immigrant', story: 'Giuseppe’s older brother moved to New York in 1913. Giuseppe planned to join him, but after 1924 the wait for an Italian visa is impossibly long.',
        opts: ['The Dawes Plan', 'Immigration Act of 1924', 'Fordney-McCumber Tariff'], a: 1,
        exp: 'The 1924 law based quotas on the 1890 census, sharply cutting visas for southern and eastern Europeans such as Italians. The Office of the Historian says its basic purpose was “to preserve the ideal of U.S. homogeneity.”', src: 'ohs-immig' },
      { name: 'Helen, 29', role: 'Civil-liberties volunteer, New York', look: 'flapper', story: 'Helen raises money for defendants arrested for their political writing. She believes that protecting unpopular speech protects everyone.',
        opts: ['Gitlow v. New York and the founding of the ACLU', 'Revenue Act of 1921', 'McNary-Haugen vetoes'], a: 0,
        exp: 'The ACLU (founded 1920) defended free speech after the Red Scare. In Gitlow (1925) the Supreme Court upheld a conviction but treated free speech as protected against the states.', src: 'lii-gitlow' },
      { name: 'James, 31', role: 'Moved from Mississippi to Chicago', look: 'migrant', story: 'James left a Mississippi farm for a Chicago meatpacking job that pays more than he ever earned. But landlords refuse to rent to him outside one crowded neighborhood.',
        opts: ['The Great Migration and Northern housing discrimination', 'Kellogg-Briand Pact', 'Washington Naval Conference'], a: 0,
        exp: 'About 2 million Black Southerners moved north between the World Wars for jobs and to escape Jim Crow, but they faced housing discrimination and segregated neighborhoods in Northern cities.', src: 'nara-migration' },
    ],
  };

  /* -------------------------------------------------------------------
     10. COURTHOUSE: evidence for the verdict
     ------------------------------------------------------------------- */
  const EVIDENCE = [
    { id: 'e1', room: 'r1', label: 'Harding’s 1920 landslide', art: 'r1_herald', notes: { mostly: 'Voters overwhelmingly chose calm after war, strikes and depression, so normalcy had a clear public mandate.', partial: 'A landslide shows what voters hoped for, not whether the policies later delivered for everyone.', un: 'Popularity in 1920 does not prove the decade’s policies succeeded.' }, leans: ['mostly'] },
    { id: 'e2', room: 'r1', label: 'The 1920–21 depression ended', art: 'r1_parade', notes: { mostly: 'The sharp postwar depression ended by 1922 and a long boom followed.', partial: 'Recovery came, but historians debate how much government policy caused it.', un: 'Recovery alone does not answer who benefited from it.' }, leans: ['mostly', 'partial'] },
    { id: 'e3', room: 'r2', label: 'Budget and Accounting Act (1921)', art: 'r2_budget', notes: { mostly: 'Harding created a lasting national budget system and an independent auditor: real, durable reform.', partial: 'A genuine reform, though it did not prevent corruption elsewhere in the administration.', un: 'Good budgeting did not stop officials like Fall from abusing public resources.' }, leans: ['mostly', 'partial'] },
    { id: 'e4', room: 'r2', label: 'Mellon tax cuts', art: 'r2_revenue', notes: { mostly: 'Supporters credit the tax cuts with encouraging investment and growth.', partial: 'Growth followed, but the largest benefits went to the wealthy.', un: 'Critics argue the cuts mainly helped the rich and fed speculation.' }, leans: ['mostly', 'partial', 'un'] },
    { id: 'e5', room: 'r2', label: '1922 railroad strike injunction', art: 'r2_wall', notes: { mostly: 'Order was restored and rail service resumed.', partial: 'Stability for business came at the expense of workers’ bargaining power.', un: 'Federal power was used to break a strike, showing that normalcy favored employers.' }, leans: ['partial', 'un'] },
    { id: 'e6', room: 'r3', label: 'Teapot Dome bribery', art: 'r3_board', notes: { mostly: 'The system worked: the press, the Senate and the courts exposed and punished corruption.', partial: 'Corruption happened, but accountability institutions responded.', un: 'A cabinet officer sold public resources for bribes, so normalcy concealed serious corruption.' }, leans: ['partial', 'un'] },
    { id: 'e7', room: 'r3', label: 'Senate investigation and McGrain v. Daugherty', art: 'r3_senate', notes: { mostly: 'Congress’s power to investigate was strengthened, a lasting safeguard.', partial: 'A positive outcome born from a scandal.', un: 'Safeguards worked only after the damage was done.' }, leans: ['mostly', 'partial'] },
    { id: 'e8', room: 'r4', label: 'Debt cut and budget surpluses', art: 'r4_tax', notes: { mostly: 'The federal debt fell from about $25.5 billion to about $16.9 billion: a frugal, stable government.', partial: 'Fiscal discipline was real, but it came with little help for struggling groups.', un: 'Surpluses were chosen over farm relief and other needs.' }, leans: ['mostly', 'partial'] },
    { id: 'e9', room: 'r4', label: 'McNary-Haugen vetoes (farm distress)', art: 'r4_farm', notes: { mostly: 'Coolidge avoided costly price supports that critics feared would cause overproduction.', partial: 'Cities boomed while farmers struggled, so prosperity was uneven.', un: 'Farmers were left behind throughout the decade.' }, leans: ['partial', 'un'] },
    { id: 'e10', room: 'r4', label: 'Speculation and the 1929 crash', art: 'r4_ticker', notes: { mostly: 'The crash came after Coolidge left office and had many causes.', partial: 'The boom contained weaknesses that policy did not address.', un: 'Overconfidence and speculation helped set up the Great Depression.' }, leans: ['partial', 'un'] },
    { id: 'e11', room: 'r5', label: 'The Dawes Plan', art: 'r5_dawes', notes: { mostly: 'American leadership calmed the German crisis and stabilized Europe for years.', partial: 'It worked temporarily, but it depended on continued American lending.', un: 'The system collapsed when U.S. loans stopped, so the stability was fragile.' }, leans: ['mostly', 'partial', 'un'] },
    { id: 'e12', room: 'r5', label: 'Washington Naval Conference', art: 'r5_naval', notes: { mostly: 'Real arms limits that saved money and eased tensions.', partial: 'Limits on battleships, but a cruiser race and no enforcement.', un: 'The treaties did not prevent later aggression.' }, leans: ['mostly', 'partial'] },
    { id: 'e13', room: 'r5', label: 'Kellogg-Briand Pact', art: 'r5_kellogg', notes: { mostly: 'Most nations renounced war, a powerful statement of peace.', partial: 'A noble principle without enforcement.', un: 'With no enforcement, it failed its first real test in 1931.' }, leans: ['partial', 'un'] },
    { id: 'e14', room: 'r6', label: 'Immigration Act of 1924', art: 'r6_immig', notes: { mostly: 'Supporters believed restriction protected jobs and stability.', partial: 'Stability for some was built on excluding others.', un: 'The law excluded people by national origin and race, so normalcy was not for everyone.' }, leans: ['partial', 'un'] },
    { id: 'e15', room: 'r6', label: 'Gitlow v. New York', art: 'r6_gitlow', notes: { mostly: 'Free speech gained protection against state governments.', partial: 'Gitlow lost, but constitutional rights expanded.', un: 'A man was imprisoned for publishing political ideas.' }, leans: ['partial'] },
    { id: 'e16', room: 'r6', label: 'Tulsa 1921 and the failed Dyer bill', art: 'r6_unequal', notes: { mostly: 'The House did pass an anti-lynching bill, and Harding spoke for equal treatment.', partial: 'Some leaders spoke out, but national politics failed to protect Black Americans.', un: 'Racial violence went unpunished and federal protection failed.' }, leans: ['un', 'partial'] },
  ];

  const VERDICTS = {
    mostly: { name: 'Mostly successful', d: 'The policies helped restore confidence and stability after World War I.' },
    partial: { name: 'Partially successful', d: 'The era brought prosperity and stability for some while leaving significant problems unresolved.' },
    un: { name: 'Mostly unsuccessful', d: 'Failures of leadership, corruption, exclusion and economic weaknesses undermined the promise of normalcy.' },
  };

  const FOLLOWUPS = [
    'Which groups benefited most from normalcy, and which faced the greatest disadvantages?',
    'How did the press and Congress hold officials accountable in Teapot Dome?',
    'Which choices about scarce resources (oil, tax dollars, farm relief) would you have made differently?',
    'How do historians use primary sources to evaluate a president? What are the limits of a single source?',
  ];

  /* -------------------------------------------------------------------
     11. COURTHOUSE: written-response questions
     Checked by an automatic rubric (keyword and evidence detection).
     It is honest about its limits and never requires one conclusion.
     evidence: [regex, label] pairs. connect: words that tie to normalcy.
     ------------------------------------------------------------------- */
  const WRITTEN = [
    {
      id: 'w1', title: 'Normalcy and Teapot Dome',
      q: 'Based on the evidence you examined, did Harding’s promise of normalcy lead to better government, or did the Teapot Dome scandal reveal serious problems with the administration? Support your answer with specific historical evidence.',
      tip: 'Make a clear claim, use at least one specific piece of evidence (a name, law, date or artifact), and explain how it supports your claim.',
      evidence: [
        ['teapot dome', 'Teapot Dome'], ['albert fall|\\bfall\\b', 'Albert Fall'], ['sinclair', 'Harry Sinclair'], ['doheny', 'Edward Doheny'], ['elk hills', 'Elk Hills'],
        ['lease', 'the oil leases'], ['bribe', 'the bribe'], ['100,000|\\$100', 'the $100,000 “loan”'], ['senate|walsh|kendrick|investigat', 'the Senate investigation'], ['wall street journal|newspaper|evening star|press', 'press coverage'],
        ['naval (oil|petroleum)|navy', 'the Navy’s oil reserves'], ['interior', 'the Interior Department'], ['budget and accounting|budget act|bureau of the budget|general accounting', 'the Budget and Accounting Act'],
        ['competitive bidding|without bidding|no bidding|secret', 'secret, no-bid leases'], ['\\b(1921|1922|1923|1924|1927|1929)\\b', 'a specific date'], ['convicted|prison|jail', 'Fall’s conviction'], ['mcgrain', 'McGrain v. Daugherty'], ['forbes|veterans bureau|ohio gang|daugherty', 'other Harding-era scandals'],
      ],
      connect: ['normalcy', 'normal', 'public trust', 'trust', 'accountab', 'honest', 'better government', 'stability', 'promise', 'corrupt', 'oversight', 'public interest', 'public resources'],
    },
    {
      id: 'w2', title: 'Government, Business and the Public Interest',
      q: 'How did the federal government’s relationship with business shape America’s return to normalcy? Choose at least one policy (for example the Mellon tax cuts, the Fordney-McCumber Tariff, the Budget and Accounting Act, the 1922 strike injunction, or the farm vetoes) and argue whether it served the public interest.',
      tip: 'Name the policy, explain who it helped and who it hurt, and say whether that served the public as a whole.',
      evidence: [
        ['mellon', 'Andrew Mellon'], ['tax cut|revenue act|lower(ed)? tax|tax rate', 'the tax cuts'], ['tariff|fordney|mccumber|import', 'the Fordney-McCumber Tariff'], ['budget and accounting|budget act|bureau of the budget|general accounting|auditor', 'the Budget and Accounting Act'],
        ['injunction|railroad strike|shopmen|daugherty|1922 strike', 'the 1922 railroad strike'], ['mcnary|haugen|farm|crop', 'farm policy'], ['debt|surplus', 'debt reduction'], ['coolidge', 'Coolidge'], ['harding', 'Harding'],
        ['chief business|business of the american people', 'Coolidge’s 1925 speech'], ['teapot|lease', 'Teapot Dome'], ['73|58|25 percent|25%', 'specific tax rates'], ['\\b(1921|1922|1924|1926|1927|1928)\\b', 'a specific date'], ['consumer|price', 'effects on consumers'], ['worker|labor|union', 'effects on workers'],
      ],
      connect: ['normalcy', 'normal', 'public interest', 'public', 'common good', 'everyone', 'stability', 'prosperity', 'wealthy', 'fair'],
    },
    {
      id: 'w3', title: 'Freedom and Opportunity for All?',
      q: 'Did the political and economic choices of the 1920s protect freedom and opportunity equally for all Americans? Support your claim with evidence about at least one group of people.',
      tip: 'Pick a group (immigrants, workers, farmers, Black Americans, political radicals, business owners), give specific evidence, and explain what it shows about equal freedom or opportunity.',
      evidence: [
        ['immigration act|johnson-reed|quota|1890 census|national origin', 'the Immigration Act of 1924'], ['japan|japanese|asia', 'Japanese exclusion'], ['ellis island|immigrant', 'immigrants'],
        ['gitlow', 'Gitlow v. New York'], ['first amendment|fourteenth amendment|free speech|freedom of speech', 'free-speech protections'], ['aclu|civil liberties', 'the ACLU'], ['palmer|red scare|raids', 'the Palmer Raids'], ['debs', 'Eugene Debs'],
        ['tulsa|greenwood', 'the Tulsa Race Massacre'], ['dyer|lynching', 'the Dyer Anti-Lynching Bill'], ['great migration|migrat', 'the Great Migration'], ['jim crow|segregat|discriminat', 'segregation and discrimination'],
        ['farmer|mcnary|haugen', 'farmers'], ['worker|strike|union|injunction', 'workers'], ['\\b(1919|1920|1921|1922|1924|1925)\\b', 'a specific date'],
      ],
      connect: ['normalcy', 'normal', 'equal', 'equally', 'freedom', 'opportunity', 'rights', 'liberty', 'excluded', 'left out', 'fair', 'all americans', 'everyone'],
    },
  ];
  // Common factual errors the checker watches for (applies to every question)
  const RED_FLAGS = [
    { re: 'harding[^.!?]{0,60}\\b(took|accepted|received|got|pocketed)\\b[^.!?]{0,40}\\bbribe', fix: 'No evidence shows Harding personally took bribes. Interior Secretary Albert Fall was the official convicted of accepting a bribe.' },
    { re: '\\bfall\\b[^.!?]{0,40}\\b(acquitted|found innocent|found not guilty|was innocent)', fix: 'Albert Fall was convicted of accepting a bribe in 1929. It was Edward Doheny who was acquitted.' },
    { re: 'doheny[^.!?]{0,40}\\b(convicted|went to prison|was jailed|found guilty)', fix: 'Edward Doheny was acquitted in 1930, even though Fall was convicted of taking his money.' },
    { re: 'teapot dome[^.!?]{0,30}\\b(in|of) california', fix: 'Teapot Dome is in Wyoming. The other reserve, Elk Hills, is in California.' },
    { re: 'elk hills[^.!?]{0,30}\\b(in|of) wyoming', fix: 'Elk Hills is in California. Teapot Dome is the Wyoming reserve.' },
    { re: 'coolidge[^.!?]{0,40}(arranged|signed|approved|granted)[^.!?]{0,30}leases?', fix: 'Coolidge had no role in arranging the oil leases. Interior Secretary Albert Fall signed them in 1922.' },
    { re: 'coolidge[^.!?]{0,40}\\bcaused\\b[^.!?]{0,20}(great )?depression', fix: 'The Depression began after Coolidge left office and had many causes. You can argue his policies contributed, but “caused” overstates the evidence.' },
    { re: 'harding[^.!?]{0,40}vetoe?d?[^.!?]{0,40}mcnary', fix: 'It was Coolidge, not Harding, who vetoed the McNary-Haugen farm bills (1927 and 1928).' },
    { re: 'dawes plan[^.!?]{0,30}\\b(1919|1920|1921|1929)\\b', fix: 'The Dawes Plan was proposed in 1924. The Young Plan came in 1929.' },
    { re: '(1924|immigration act)[^.!?]{0,60}1910 census', fix: 'The 1924 law used the 1890 census. The 1910 census was the basis of the 1921 law.' },
    { re: 'gitlow[^.!?]{0,60}\\b(won|was freed by the court|conviction was overturned|overturned his conviction)', fix: 'The Supreme Court upheld Gitlow’s conviction in 1925. His later release came from a pardon by New York’s governor.' },
    { re: '(united states|u\\.s\\.|america)[^.!?]{0,20}\\bjoined\\b[^.!?]{0,20}league of nations', fix: 'The United States never joined the League of Nations; the Senate rejected the Treaty of Versailles.' },
    { re: 'harding[^.!?]{0,40}\\bpresident\\b[^.!?]{0,20}\\b(1925|1926|1927|1928|1929)\\b', fix: 'Check your dates: Harding died in August 1923, so he was not president after that.' },
  ];

  /* -------------------------------------------------------------------
     12. CONVERSATIONS
     label: 'Fictional museum guide' | 'Historical composite' | 'Fictional character'
     Each topic: q (what the visitor asks), a (what the character says), src (source id)
     Characters speak in their own words; these are not historical quotations.
     ------------------------------------------------------------------- */
  const PEOPLE = {
    // ---------- town ----------
    guide: { name: 'Docent Dot', label: 'Fictional museum guide', look: 'guide',
      greet: 'Welcome to the Normalcy Files! You are standing in the town square, the museum’s main hub. Every building with a numbered banner is an exhibit.',
      topics: [
        { q: 'How do I play?', a: ['Walk with W A S D or the arrow keys. When you see “Press E,” press E or Space.', 'Sparkles mark things you have not examined yet. A gold star marks each room’s game. Press M for the map any time.'] },
        { q: 'Where should I start?', a: ['Start with Exhibit 1, Union Station, in the top-left corner of town. The gold arrow at the top of the screen always points to your next stop.', 'The exhibits go clockwise around the square, and you finish at the Courthouse.'] },
        { q: 'What does “normalcy” mean?', a: ['It was Warren G. Harding’s campaign word in 1920. He promised calm after the war: less government experimenting, more focus at home.', 'You can hear him say it in his own voice on the gramophone in Exhibit 1.'], src: 'loc-readjust' },
        { q: 'Is there a big question I should think about?', a: ['Two, actually. First: how did the federal government’s relationship with business and the public interest shape the return to normalcy?', 'Second: did the choices of the 1920s protect freedom and opportunity equally for all Americans? The Courthouse will ask you to answer them.'] },
      ] },
    vet: { name: 'Returning Veteran', label: 'Historical composite', look: 'veteran',
      greet: 'Got home from France in ’19. Everybody threw a parade. Then everybody asked if I had a job yet.',
      topics: [
        { q: 'What was coming home like?', a: ['Buffalo, Chicago, New York: every city had parades. But the war factories were shutting down, and prices had gone way up during the war.'], src: 'p-parade' },
        { q: 'Why do people want “normalcy”?', a: ['Strikes, bombs, the Red Scare, then a depression in 1920. Folks were worn out. A calm fellow like Harding promising quiet sounded mighty good.'], src: 'miller-harding' },
      ] },
    newsboy: { name: 'Newsboy', label: 'Fictional character', look: 'newsboy',
      greet: 'Extra! Extra! Senate committee digs into the Navy oil leases!',
      topics: [
        { q: 'What’s the big story?', a: ['The Interior Secretary leased the Navy’s oil to two oilmen, and now the Senate wants to know where his money came from. It’s all at the Daily Ledger, Exhibit 3.'], src: 'senate-td' },
        { q: 'How do reporters know what’s true?', a: ['My editor says check the records before you print the rumor. A headline tells you what somebody said, not always what happened.'] },
      ] },
    biz: { name: 'Factory Owner', label: 'Historical composite', look: 'businessman',
      greet: 'Lower taxes, a balanced budget, and a government that stays out of my way. That is normalcy to me.',
      topics: [
        { q: 'What do you want from Washington?', a: ['Mr. Mellon at the Treasury has the right idea: cut the wartime tax rates so men like me can invest. And keep the tariff high so cheap imports don’t undercut my prices.'], src: 'cato-tax' },
        { q: 'What about your workers?', a: ['I won’t pretend everyone agrees. The railroad men struck in ’22 and the government got a court order against them. Ask a worker and you’ll hear a different story.'], src: 'dah-rail' },
      ] },
    farmer: { name: 'Wheat Farmer', label: 'Historical composite', look: 'farmer',
      greet: 'Wheat paid well during the war. Now prices have fallen through the floor, and the bank still wants its mortgage.',
      topics: [
        { q: 'Why are farmers struggling?', a: ['We planted more to feed Europe during the war. When the war ended, demand dropped and prices with it. The cities are booming, but not my county.'], src: 'miller-coolidge' },
        { q: 'Is the government helping?', a: ['Congress passed the McNary-Haugen bill twice to support crop prices. President Coolidge vetoed it both times, in 1927 and 1928. Exhibit 4 has the whole story.'], src: 'miller-coolidge' },
      ] },
    flapper: { name: 'Young Woman about Town', label: 'Fictional character', look: 'flapper',
      greet: 'Have you heard a radio yet? The whole country can hear the same program at once!',
      topics: [
        { q: 'What’s new in the twenties?', a: ['Radio, motion pictures, cars that ordinary families can afford. One national culture, coast to coast.'], src: 'ushistory-46' },
        { q: 'Is everyone doing well?', a: ['Not everyone. The farmers on the edge of town are hurting, and my neighbor’s cousin can’t get a visa from Italy anymore.'] },
      ] },
    cop: { name: 'Officer Kelly', label: 'Fictional character', look: 'police',
      greet: 'Lost, friend? Happens all the time. What do you need?',
      topics: [
        { q: 'I’m lost. How do I find an exhibit?', a: ['Press M for the town map. Click “Go” next to any room and you’ll be standing at its front door.'] },
        { q: 'How do I leave a building?', a: ['Every room has a red EXIT mat at the bottom. Walk onto it and you’re back in the square.'] },
        { q: 'How do I know where I’ve been?', a: ['The sign over each door gets a check mark once you’ve visited, and the map lists every room with your progress.'] },
      ] },
    immigrant: { name: 'Neighbor', label: 'Historical composite', look: 'immigrant',
      greet: 'My cousin in Naples was supposed to join us this year. Now I do not know when we will see her.',
      topics: [
        { q: 'What happened to your cousin?', a: ['The new law of 1924 counts quotas from the 1890 census. Back then there were few Italians here, so now there are very few visas for Italians.'], src: 'ohs-immig' },
        { q: 'Where can I learn more?', a: ['The Community Hall to the south. Exhibit 6 shows the actual law.'] },
      ] },

    // ---------- Exhibit 1 ----------
    r1_docent: { name: 'Station Master Ruth', label: 'Fictional museum guide', look: 'stationmaster',
      greet: 'Welcome to Union Station, 1919 to 1920. Trains bring soldiers home, and a lot of worries with them.',
      topics: [
        { q: 'What should I look at first?', a: ['Start with the gramophone on the left. It plays Harding’s real 1920 recording, and the full transcript is right beside the player.'], src: 'loc-readjust' },
        { q: 'Why were people so worried in 1919?', a: ['Prices had shot up during the war, and then came strikes, bombings and the Palmer Raids. In 1920 a sharp depression hit as well.', 'Read the timeline on the wall for the whole year in order.'], src: 'fbi-palmer' },
        { q: 'What’s the game at the ticket window?', a: ['“Restore Stability.” You play a fictional adviser and face four real problems. After each choice it shows you what the government actually did.'] },
      ] },
    r1_union: { name: 'Steelworker', label: 'Historical composite', look: 'migrant',
      greet: 'I came out of the Gary mills in ’19. Long shifts, low pay, and no union the bosses would talk to.',
      topics: [
        { q: 'Why did so many workers strike in 1919?', a: ['Prices went up fast during the war and wages didn’t keep pace. Workers wanted their unions recognized so they could bargain.'], src: 'p-steel' },
        { q: 'How did the steel strike end?', a: ['We walked out in September 1919. By early 1920 it was over, and the companies never recognized the union.'], src: 'p-steel' },
        { q: 'Did the public support you?', a: ['Not much. With the Red Scare in the papers, plenty of people decided strikers must be radicals. Governor Coolidge said there was “no right to strike against the public safety.” He meant the Boston police, but folks applied it to all of us.'], src: 'loc-1920' },
      ] },

    // ---------- Exhibit 2 ----------
    r2_docent: { name: 'Usher Mr. Amos', label: 'Fictional museum guide', look: 'usher',
      greet: 'Good evening. This is the president’s office as it might have looked in 1921 to 1923.',
      topics: [
        { q: 'What did Harding actually change?', a: ['The Budget and Accounting Act of 1921 gave the country its first national budget and an independent auditor. That office still exists, now called the Government Accountability Office.'], src: 'stat-budget' },
        { q: 'What are the papers on the desk?', a: ['Three real laws: the Budget Act, the Revenue Act of 1921 and the Fordney-McCumber Tariff of 1922. Each file shows a scan of the printed law.'] },
        { q: 'How did the Harding years end?', a: ['He died suddenly in San Francisco on August 2, 1923. Many of the scandals among his appointees only came out afterward.'], src: 'miller-harding' },
      ] },
    r2_worker: { name: 'Railroad Shopman', label: 'Historical composite', look: 'worker',
      greet: 'They call it normalcy. From the railroad shops, it looked a lot like the old days, when the government sided with the bosses.',
      topics: [
        { q: 'Why did you strike in 1922?', a: ['The federal Railroad Labor Board ruled against us on wages and work rules. On July 1, 1922, shop workers walked out all over the country.'], src: 'dah-rail' },
        { q: 'What did the government do?', a: ['Attorney General Daugherty went to a federal court and got a sweeping injunction against the strikers and our leaders. The settlement that October mostly favored the railroads.'], src: 'dah-rail' },
        { q: 'Was the government working for business?', a: ['That’s the question, isn’t it? Tax cuts for the rich, a tariff for manufacturers, a court order for the railroads. Somebody in this room will tell you that was good for the country. I’d ask: good for whom?'] },
      ] },

    // ---------- Exhibit 3 ----------
    r3_docent: { name: 'Night Editor Gus', label: 'Fictional museum guide', look: 'editor',
      greet: 'I’ve been looking through the Senate’s investigation of the oil leases. Something about this arrangement does not seem right.',
      topics: [
        { q: 'Why did the government control these oil reserves?', a: ['The Navy was switching its ships from coal to oil. Before the war the government set aside oil fields, Elk Hills in California and Teapot Dome in Wyoming, so the fleet would never run dry in an emergency.'], src: 'senate-td' },
        { q: 'How did private businesses become involved?', a: ['In 1921 Harding moved the reserves from the Navy to the Interior Department. Secretary Albert Fall then leased Teapot Dome to Harry Sinclair and Elk Hills to Edward Doheny, in secret, with no competitive bidding.', 'Doheny had handed Fall $100,000 that they both called a “loan.”'], src: 'senate-td' },
        { q: 'What finally exposed the scandal?', a: ['A Wall Street Journal story on April 14, 1922. The next day Senator Kendrick of Wyoming demanded an investigation, and Senator Thomas Walsh kept digging until the money trail came out.'], src: 'senate-td' },
        { q: 'Did President Harding take bribes?', a: ['No evidence says he did. He died in 1923, before most of this surfaced. What we can prove is corruption in his administration, most of all Fall’s. Don’t print what you can’t prove.'], src: 'miller-harding' },
      ] },
    r3_cub: { name: 'Cub Reporter Lou', label: 'Fictional character', look: 'newsboy',
      greet: 'First week on the job! The editor says I have to label every clipping before I pin it up.',
      topics: [
        { q: 'What’s the difference between primary and secondary sources?', a: ['Primary sources were made at the time, like the 1924 Evening Star front page. Secondary sources explain it later, like the Senate’s history of the investigation.'] },
        { q: 'What was McGrain v. Daugherty?', a: ['A 1927 Supreme Court case that came out of these investigations. It confirmed that Congress can force witnesses to testify before its committees.'], src: 'senate-td' },
        { q: 'What happened to everyone in the end?', a: ['The Supreme Court cancelled the leases in 1927. Fall was convicted in 1929 and went to prison. Doheny was acquitted in 1930. Sinclair served time for contempt.'], src: 'history-fall' },
      ] },

    // ---------- Exhibit 4 ----------
    r4_docent: { name: 'Press Secretary Mae', label: 'Fictional museum guide', look: 'flapper',
      greet: 'Settle in. The president’s press conference is about to begin. He won’t say much. He never does.',
      topics: [
        { q: 'Was Coolidge really silent?', a: ['Not really. He held 520 press conferences, nearly eight a month, and spoke on the radio at least once a month. He just chose his words carefully.'], src: 'miller-coolidge' },
        { q: 'How did he become president?', a: ['Harding died on August 2, 1923. Early the next morning, Coolidge’s father swore him in at the family farmhouse in Vermont. Look for the composite photograph of that scene on the wall.'], src: 'p-plymouth' },
        { q: 'What was his economic plan?', a: ['Keep spending low, cut taxes with Treasury Secretary Mellon, and pay down the war debt. The debt fell from about $25.5 billion in 1919 to about $16.9 billion in 1929.'], src: 'fiscal-debt' },
      ] },
    r4_farmer: { name: 'Farm Delegate', label: 'Historical composite', look: 'farmer',
      greet: 'I came to Washington with a delegation of western farmers. We stood right on the White House lawn.',
      topics: [
        { q: 'Why are farmers struggling?', a: ['We expanded during the war, then prices collapsed. Through the whole boom, most of us never caught up.'], src: 'miller-coolidge' },
        { q: 'What was the McNary-Haugen bill?', a: ['A plan for a government corporation to buy surplus crops at set prices. Congress passed it twice; the president vetoed it twice, saying it was too costly and would encourage overproduction.'], src: 'miller-coolidge' },
        { q: 'How do you feel about “Coolidge Prosperity”?', a: ['I read about stock prices and new radios. Out on the farm, prosperity is something that happens to other people.'] },
      ] },

    // ---------- Exhibit 5 ----------
    r5_docent: { name: 'Envoy Mr. Lindqvist', label: 'Fictional museum guide', look: 'diplomat',
      greet: 'Welcome to the Hall of Nations. Watch the great map: the gold lines show money crossing the Atlantic.',
      topics: [
        { q: 'Why did Germany owe so much money?', a: ['After the war the Allies demanded reparations. In 1921 the Reparation Commission set Germany’s bill at 132 billion gold marks, about $31.5 billion.'], src: 'ohs-dawes' },
        { q: 'What did the Dawes Plan do?', a: ['In 1924 it lowered Germany’s yearly payments, introduced a new currency, ended the occupation of the Ruhr and arranged a $200 million loan. American banks kept lending for about four years.'], src: 'ohs-dawes' },
        { q: 'Was America isolationist?', a: ['It stayed out of the League of Nations, yes. But it hosted the Washington Naval Conference, shaped the Dawes Plan and led the Kellogg-Briand Pact. Isolated? Not with its money and treaties everywhere.'], src: 'ohs-naval' },
      ] },
    r5_banker: { name: 'Bank Clerk from New York', label: 'Historical composite', look: 'businessman',
      greet: 'I spend my days counting bonds for loans to Germany. Strange work for a fellow who’s never left Manhattan.',
      topics: [
        { q: 'Why are American banks lending to Germany?', a: ['After the Dawes Plan, investors trusted that Germany would pay. J.P. Morgan sold the first big loan here, and buyers snapped it up.'], src: 'ohs-dawes' },
        { q: 'What happens if the lending stops?', a: ['Then Germany can’t pay reparations, Britain and France can’t pay us back, and the whole circle jams. That is what happened after 1928.'], src: 'ohs-dawes' },
      ] },

    // ---------- Exhibit 6 ----------
    r6_docent: { name: 'Librarian Mrs. Okafor', label: 'Fictional museum guide', look: 'librarian',
      greet: 'Welcome to the reading room. Please handle these stories with care; they are about real people.',
      topics: [
        { q: 'What did the 1924 immigration law do?', a: ['It limited each nationality to 2 percent of its numbers in the 1890 census. That favored northern and western Europeans, cut southern and eastern Europeans, and effectively barred immigration from Japan.'], src: 'ohs-immig' },
        { q: 'What was Gitlow v. New York about?', a: ['Benjamin Gitlow was convicted for publishing a radical manifesto. In 1925 the Supreme Court upheld his conviction, but it also treated free speech as protected from state governments. The opinion pages are at the bench.'], src: 'lii-gitlow' },
        { q: 'How were Black Americans affected?', a: ['Many moved north in the Great Migration for better jobs, but met discrimination there too. The 1921 Tulsa massacre and the Senate’s blocking of the Dyer anti-lynching bill show how little federal protection there was.'], src: 'nara-migration' },
      ] },
    r6_volunteer: { name: 'Civil-Liberties Volunteer', label: 'Historical composite', look: 'archivist',
      greet: 'I help raise bail money for people arrested for what they wrote or said. It’s unpopular work.',
      topics: [
        { q: 'Why was the ACLU founded?', a: ['In 1920, after the Palmer Raids, reformers created the American Civil Liberties Union to defend free speech and fair legal process, even for people they disagreed with.'], src: 'aclu' },
        { q: 'Does free speech have limits?', a: ['The Court said yes in Gitlow: a state can punish speech that urges overthrowing the government. Justices Holmes and Brandeis disagreed; Holmes wrote that “every idea is an incitement.”'], src: 'lii-gitlow' },
        { q: 'Why defend people you disagree with?', a: ['Because the rules you use against them can be used against you. That argument runs through this whole room.'] },
      ] },

    // ---------- Courthouse and Library ----------
    court_docent: { name: 'Clerk of Court Mr. Bell', label: 'Fictional museum guide', look: 'clerk',
      greet: 'Order in the court! Walk up to the judge’s bench when you are ready.',
      topics: [
        { q: 'What happens at the bench?', a: ['Two parts. First, choose a verdict on normalcy and back it with evidence. Second, answer written questions and submit them for feedback.'] },
        { q: 'How are written answers checked?', a: ['By an automatic rubric, not a teacher and not an AI. It looks for a clear claim, specific evidence, reasoning words like “because,” a connection to normalcy, and common factual mistakes. It can miss things, so treat it as a coach.'] },
        { q: 'Is there a right answer?', a: ['No single one. A well-supported argument can earn full marks whatever conclusion it reaches.'] },
      ] },
    library_docent: { name: 'Archivist Miss Ida', label: 'Fictional museum guide', look: 'archivist',
      greet: 'Shh, welcome to the archive. Every quotation, photograph and claim in the museum traces back to a source on these shelves.',
      topics: [
        { q: 'Where is the bibliography?', a: ['In the card catalog on the left. It is in MLA style, and you can copy it straight into Word.'] },
        { q: 'Where does the music come from?', a: ['Real jazz recordings made between 1920 and 1924, now in the public domain. The music credits on the lectern list each one with a link.'] },
        { q: 'What are the two big questions?', a: ['Read the board on the wall. One is about government, business and the public interest; the other asks whether freedom and opportunity were shared equally.'] },
      ] },
  };

  /* -------------------------------------------------------------------
     13. FLAVOR SIGNS around town
     ------------------------------------------------------------------- */
  const SIGNS = {
    bijou: { title: 'The Bijou Picture House', text: 'Movie palaces boomed in the 1920s, and silent films gave way to sound after The Jazz Singer (1927). This theater is decorative; the exhibits are in the buildings with numbered banners.' },
    bank: { title: 'First National Bank', text: 'Banks grew quickly in the 1920s, and many lent money for stocks and consumer goods. This building is decorative. For the economics of the era, visit Exhibit 4.' },
    diner: { title: 'Soda Fountain & Diner', text: 'Under Prohibition (1920–1933), soda fountains and diners boomed. This building is decorative.' },
    garage: { title: 'Motor Garage', text: 'Mass production made cars affordable for ordinary families in the 1920s, transforming work and leisure. (Source: ushistory.org, “The Decade That Roared.”)' },
    hub: { title: 'Museum Hub: Town Square', text: 'You are at the center of the museum. Exhibits 1 to 3 line the north road, Exhibit 4 is to the east, Exhibits 5 and 6 are to the south, the Courthouse is in the southwest corner, and the Library is to the west. Press M to open the map.' },
  };

  NF.CONTENT = { TEAM, MEDIA, MUSIC, ROOM_MUSIC, HELPDESK, BIG_QUESTIONS, SOURCES, ROOMS, ARTIFACTS, GAMES, EVIDENCE, VERDICTS, FOLLOWUPS, WRITTEN, RED_FLAGS, PEOPLE, SIGNS,
    title: 'THE NORMALCY FILES', subtitle: 'A journey through America’s search for stability after World War I',
    centralQuestion: 'Did America’s return to normalcy restore stability after World War I, or did it conceal deeper problems in American government and society?' };
  NF.src = function (id) { return SOURCES.find((s) => s.id === id); };
})();

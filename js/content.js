/* =====================================================================
   THE NORMALCY FILES — content.js
   ALL historical content lives here: rooms, artifacts, narration scripts,
   mini-game data, evidence, sources and team credits.
   Edit this file to change text, swap media, or add your names.
   Every factual claim is tied to a source id listed in SOURCES below.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});

  /* -------------------------------------------------------------------
     1. TEAM CREDITS — replace the placeholder names with your group.
     ------------------------------------------------------------------- */
  const TEAM = [
    { role: 'Captain', name: 'Dyuti Hira', duties: 'Coordinates the project, monitors progress, and makes sure the museum meets every assignment requirement.' },
    { role: 'Tech Geek', name: 'Ashwin Kirubakaran', duties: 'Manages website development, game mechanics, visual implementation, and technical troubleshooting.' },
    { role: 'Main Researcher', name: 'Nitya Gupta', duties: 'Verifies historical accuracy, selects artifacts, evaluates sources, and prepares the historical narration.' },
    { role: 'Secretary', name: 'Ikeolu Ibironke', duties: 'Tracks tasks, organizes materials and citations, and maintains the bibliography and submission documents.' },
  ];

  /* -------------------------------------------------------------------
     2. MEDIA PATHS — drop your recordings into these paths.
     If a file is missing, the game falls back to a text-to-speech
     preview with captions, so nothing ever breaks.
     ------------------------------------------------------------------- */
  const MEDIA = {
    helpdeskVideo: 'media/video/helpdesk.mp4',
    helpdeskCaptions: 'media/captions/helpdesk.vtt',
    narration: {
      r1: 'media/audio/room1.mp3', r2: 'media/audio/room2.mp3', r3: 'media/audio/room3.mp3',
      r4: 'media/audio/room4.mp3', r5: 'media/audio/room5.mp3', r6: 'media/audio/room6.mp3',
    },
    // Streams from the Library of Congress (public, embeddable). Needs an internet connection.
    hardingRecording: 'https://tile.loc.gov/storage-services/media/ammem/NationsForum/nforum-9000056.mp3',
  };

  /* -------------------------------------------------------------------
     3. HELP-DESK VIDEO SCRIPT (about 60–70 seconds)
     ------------------------------------------------------------------- */
  const HELPDESK = [
    "Hi, and welcome to The Normalcy Files — a playable museum about America from 1920 to 1929.",
    "After World War One, Warren G. Harding promised a “return to normalcy.” Our question: did normalcy really restore stability, or did it hide deeper problems?",
    "Walk with W-A-S-D or the arrow keys — or the on-screen pad on a phone.",
    "Walk up to anything sparkling and press E or Space. Each artifact opens an archive file with its date, its creator, and whether it's a primary or secondary source.",
    "Walk into a door to enter a building, and step on the red exit mat to leave.",
    "Every room has a short mini-game marked with a gold star, and each one explains what really happened.",
    "Press N to hear the room's narration, with captions and a transcript.",
    "Lost? Press M for the map — you can fast-travel to any exhibit — and follow the gold arrow at the top of the screen.",
    "Visit all six exhibits, then judge normalcy for yourself at the Courthouse. The Library holds every source we used.",
    "Okay — let's open the files!",
  ];

  /* -------------------------------------------------------------------
     4. ESSENTIAL QUESTIONS
     ------------------------------------------------------------------- */
  const EQS = {
    A1: 'How do citizens, civic ideals, and government institutions interact to balance the needs of individuals and the common good?',
    A2: 'How have economic, political, and cultural decisions promoted or prevented personal freedom, individual responsibility, equality, and respect for human dignity?',
    C1: 'How can individuals, groups, and societies apply economic reasoning to make difficult choices about scarce resources?',
    D1: 'How do interpretations of past events inform our understanding of cause and effect, continuity and change, and current public policy issues?',
    D2: 'Why does examining multiple, contrasting perspectives produce a better understanding of the past?',
  };

  /* -------------------------------------------------------------------
     5. SOURCES (bibliography, MLA 9th edition style)
     type: primary | secondary | tertiary
     ------------------------------------------------------------------- */
  const SOURCES = [
    { id: 'loc-1920', type: 'secondary', inst: 'Library of Congress', mla: 'Library of Congress. “Presidential Election of 1920.” <i>From War to Normalcy: An Introduction to the Nation’s Forum Collection</i>, American Leaders Speak: Recordings from World War I and the 1920 Election, Library of Congress.', url: 'https://www.loc.gov/collections/world-war-i-and-1920-election-recordings/articles-and-essays/from-war-to-normalcy/presidential-election-of-1920/', use: 'Context for the 1920 election, Harding’s “normalcy” campaign, Coolidge’s Boston police strike telegram, and the phonograph campaign.' },
    { id: 'loc-readjust', type: 'primary', inst: 'Library of Congress', mla: 'Harding, Warren G. “Readjustment.” Recorded 29 June 1920, New York, Columbia Graphophone Manufacturing Company for the Nation’s Forum. Library of Congress, www.loc.gov/item/2016655168/.', url: 'https://www.loc.gov/item/2016655168/', use: 'Harding’s recorded “normalcy” speech (streamed in Room 1) and the verified quotation.' },
    { id: 'herald-1920', type: 'primary', inst: 'Library of Congress, Chronicling America', mla: '“Harding Elected by Overwhelming Vote.” <i>The New York Herald</i>, 3 Nov. 1920, p. 1. Chronicling America: Historic American Newspapers, Library of Congress.', url: 'https://www.loc.gov/resource/sn83045774/1920-11-03/ed-1/?sp=1', use: 'Front page announcing Harding’s 1920 landslide (Room 1).' },
    { id: 'senate-td', type: 'secondary', inst: 'United States Senate', mla: 'United States Senate. “Senate Investigates the Teapot Dome Scandal.” <i>Powers and Procedures: Investigations</i>, U.S. Senate.', url: 'https://www.senate.gov/about/powers-procedures/investigations/senate-investigates-the-teapot-dome-scandal.htm', use: 'The Wall Street Journal report, the Kendrick resolution, the Walsh investigation, Fall’s imprisonment, and McGrain v. Daugherty.' },
    { id: 'star-1924a', type: 'primary', inst: 'Library of Congress, Chronicling America', mla: '“Sinclair Made Fall $25,000 Loan, Probe Reveals.” <i>Evening Star</i> [Washington, D.C.], 25 Jan. 1924, p. 1. Chronicling America, Library of Congress.', url: 'https://www.loc.gov/resource/sn83045462/1924-01-25/ed-1/?sp=1', use: 'Period newspaper coverage of the Teapot Dome investigation (Room 3).' },
    { id: 'star-1924b', type: 'primary', inst: 'Library of Congress, Chronicling America', mla: '“President Pledges Stern Action in Pursuit of Guilty.” <i>Evening Star</i> [Washington, D.C.], 13 Feb. 1924, p. 1. Chronicling America, Library of Congress.', url: 'https://www.loc.gov/resource/sn83045462/1924-02-13/ed-1/?sp=1', use: 'Coolidge’s public response to the oil scandal, and a “Silent Cal” cartoon (Room 4).' },
    { id: 'history-fall', type: 'tertiary', inst: 'History.com / A&E Television Networks', mla: '“Cabinet Member Found Guilty in Teapot Dome Scandal.” <i>This Day in History</i>, A&E Television Networks, 25 Oct. (event date 1929).', url: 'https://www.history.com/this-day-in-history/october-25/cabinet-member-guilty-in-teapot-dome-scandal', use: 'Date of Fall’s conviction (Oct. 25, 1929), the $100,000 Doheny “loan,” and the sentence of one year and a $100,000 fine.' },
    { id: 'miller-harding', type: 'secondary', inst: 'Miller Center, University of Virginia', mla: 'Miller Center. “Warren G. Harding: Domestic Affairs.” <i>U.S. Presidents</i>, University of Virginia.', url: 'https://millercenter.org/president/harding/domestic-affairs', use: 'Harding’s budget reform, tax and tariff policy, the 1920–21 depression, Debs, his civil-rights speech, and the scandals of his administration.' },
    { id: 'miller-coolidge', type: 'secondary', inst: 'Miller Center, University of Virginia', mla: 'Miller Center. “Calvin Coolidge: Domestic Affairs.” <i>U.S. Presidents</i>, University of Virginia.', url: 'https://millercenter.org/president/coolidge/domestic-affairs', use: 'Coolidge’s tax policy with Mellon, budget surpluses, vetoes of the McNary-Haugen farm bills, press conferences and radio use, and one historian’s critical interpretation.' },
    { id: 'stat-budget', type: 'primary', inst: 'U.S. Government Publishing Office (GovInfo)', mla: 'United States, Congress. <i>Budget and Accounting Act, 1921</i>. Public Law 67-13, 42 Stat. 20, 10 June 1921. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-42/pdf/STATUTE-42-Pg20.pdf', use: 'Verified wording of the law that created the Bureau of the Budget and the General Accounting Office (Room 2).' },
    { id: 'stat-revenue', type: 'primary', inst: 'U.S. Government Publishing Office (GovInfo)', mla: 'United States, Congress. <i>Revenue Act of 1921</i>. 42 Stat. 227, 23 Nov. 1921. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-42/pdf/STATUTE-42-Pg227.pdf', use: 'Title and date of the 1921 tax law (Room 2).' },
    { id: 'stat-tariff', type: 'primary', inst: 'U.S. Government Publishing Office (GovInfo)', mla: 'United States, Congress. <i>Tariff Act of 1922</i> [Fordney-McCumber Tariff]. 42 Stat. 858, 21 Sept. 1922. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-42/pdf/STATUTE-42-Pg858-2.pdf', use: 'Date of the tariff and the wording of Section 315, the “flexible tariff” provision (Room 2).' },
    { id: 'time-1923', type: 'primary', inst: 'TIME', mla: '“National Affairs: Elasticity.” <i>TIME</i>, 28 Apr. 1923.', url: 'https://time.com/archive/6817817/national-affairs-elasticity/', use: 'A 1923 magazine explanation of the flexible tariff: the president could raise or lower duties by up to 50% on the Tariff Commission’s recommendation.' },
    { id: 'cato-tax', type: 'secondary', inst: 'Cato Institute', mla: '“The Economic Impact of Tax Changes, 1920–1939.” <i>Cato Journal</i>, Winter 2021, Cato Institute.', url: 'https://www.cato.org/cato-journal/winter-2021/economic-impact-tax-changes-1920-1939', use: 'Top income-tax rates of the 1920s (73% in 1921, 58% in 1922, 46% in 1924, 25% in 1925) and a pro–tax-cut interpretation. Note: Cato is a libertarian think tank.' },
    { id: 'dah-rail', type: 'tertiary', inst: 'Dictionary of American History (Encyclopedia.com)', mla: 'Wish, Harvey. “Railway Shopmen’s Strike.” <i>Dictionary of American History</i>, Encyclopedia.com.', url: 'https://www.encyclopedia.com/history/dictionaries-thesauruses-pictures-and-press-releases/railway-shopmens-strike', use: 'The 1922 railway shopmen’s strike: start date, roughly 400,000 union members, Daugherty’s “sweeping injunction,” and the settlement.' },
    { id: 'treasury-mellon', type: 'secondary', inst: 'U.S. Department of the Treasury', mla: 'U.S. Department of the Treasury. “Andrew W. Mellon (1921–1932).” <i>Prior Secretaries</i>, U.S. Department of the Treasury.', url: 'https://home.treasury.gov/about/history/prior-secretaries/andrew-w-mellon-1921-1932', use: 'Andrew Mellon’s long tenure as Treasury Secretary under Harding, Coolidge, and Hoover.' },
    { id: 'fiscal-debt', type: 'primary', inst: 'U.S. Department of the Treasury, Fiscal Data', mla: 'U.S. Department of the Treasury. “Historical Debt Outstanding.” <i>Fiscal Data</i>.', url: 'https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/', use: 'Federal debt totals: about $25.5 billion (fiscal 1919) and about $16.9 billion (fiscal 1929).' },
    { id: 'apus-asne', type: 'primary', inst: 'The American Presidency Project, UC Santa Barbara', mla: 'Coolidge, Calvin. “Address to the American Society of Newspaper Editors, Washington, D.C.” 17 Jan. 1925. <i>The American Presidency Project</i>, edited by Gerhard Peters and John T. Woolley.', url: 'https://www.presidency.ucsb.edu/documents/address-the-american-society-newspaper-editors-washington-dc', use: 'Verified quotation: “the chief business of the American people is business.”' },
    { id: 'miller-inaug25', type: 'primary', inst: 'Miller Center, University of Virginia', mla: 'Coolidge, Calvin. “Inaugural Address.” 4 Mar. 1925. <i>Presidential Speeches</i>, Miller Center.', url: 'https://millercenter.org/the-presidency/presidential-speeches/march-4-1925-inaugural-address', use: 'Verified quotation on the “policy of economy.”' },
    { id: 'house-inaug25', type: 'secondary', inst: 'U.S. House of Representatives, History, Art & Archives', mla: 'U.S. House of Representatives. “The Inauguration of President Calvin Coolidge in 1925.” <i>Historical Highlights</i>, History, Art & Archives.', url: 'https://history.house.gov/Historical-Highlights/1901-1950/The-Inauguration-of-President-Calvin-Coolidge-in-1925/', use: 'Coolidge’s 1925 inauguration and its national radio broadcast.' },
    { id: 'ohs-dawes', type: 'secondary', inst: 'U.S. Department of State, Office of the Historian', mla: 'Office of the Historian. “The Dawes Plan, the Young Plan, German Reparations, and Inter-allied War Debts.” <i>Milestones: 1921–1936</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1921-1936/dawes', use: 'Reparations, the Ruhr occupation, the Dawes Plan’s terms, the cycle of loans and war debts, and the Young Plan.' },
    { id: 'ohs-kellogg', type: 'secondary', inst: 'U.S. Department of State, Office of the Historian', mla: 'Office of the Historian. “The Kellogg-Briand Pact, 1928.” <i>Milestones: 1921–1936</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1921-1936/kellogg', use: 'Origins, signatories, goals, Senate reservations, and limits of the Kellogg-Briand Pact.' },
    { id: 'avalon-kb', type: 'primary', inst: 'The Avalon Project, Yale Law School', mla: '“Kellogg-Briand Pact 1928.” <i>The Avalon Project: Documents in Law, History and Diplomacy</i>, Lillian Goldman Law Library, Yale Law School.', url: 'https://avalon.law.yale.edu/20th_century/kbpact.asp', use: 'Verified text of Articles I and II of the pact.' },
    { id: 'ohs-naval', type: 'secondary', inst: 'U.S. Department of State, Office of the Historian', mla: 'Office of the Historian. “The Washington Naval Conference, 1921–1922.” <i>Milestones: 1921–1936</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1921-1936/naval-conference', use: 'The Five-, Four-, and Nine-Power Treaties, the 5:5:3 ratio, and the conference’s limits.' },
    { id: 'ohs-league', type: 'secondary', inst: 'U.S. Department of State, Office of the Historian', mla: 'Office of the Historian. “The League of Nations, 1920.” <i>Milestones: 1914–1920</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1914-1920/league', use: 'Background on the League of Nations debate.' },
    { id: 'senate-versailles', type: 'secondary', inst: 'United States Senate', mla: 'United States Senate. “The Senate’s Rejection of the Treaty of Versailles.” <i>Powers and Procedures: Treaties</i>, U.S. Senate.', url: 'https://www.senate.gov/about/powers-procedures/treaties/senate-rejects-treaty-of-versailles.htm', use: 'The Senate’s Nov. 19, 1919 rejection of the treaty and the fight over the League of Nations.' },
    { id: 'ohs-immig', type: 'secondary', inst: 'U.S. Department of State, Office of the Historian', mla: 'Office of the Historian. “The Immigration Act of 1924 (The Johnson-Reed Act).” <i>Milestones: 1921–1936</i>, U.S. Department of State.', url: 'https://history.state.gov/milestones/1921-1936/immigration-act', use: 'Quota formulas, Japanese exclusion, the 1921 law, and the Act’s purpose.' },
    { id: 'stat-quota21', type: 'primary', inst: 'U.S. Government Publishing Office (GovInfo)', mla: 'United States, Congress. <i>An Act to Limit the Immigration of Aliens into the United States</i> [Emergency Quota Act]. 42 Stat. 5, 19 May 1921. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-42/pdf/STATUTE-42-Pg5.pdf', use: 'Verified wording of the 3-percent quota based on the 1910 census.' },
    { id: 'stat-immig24', type: 'primary', inst: 'U.S. Government Publishing Office (GovInfo)', mla: 'United States, Congress. <i>Immigration Act of 1924</i>. 43 Stat. 153, 26 May 1924. GovInfo.', url: 'https://www.govinfo.gov/content/pkg/STATUTE-43/pdf/STATUTE-43-Pg153-2.pdf', use: 'Verified wording of Section 11(a) (2% of the 1890 census) and Section 13(c) (exclusion of “aliens ineligible to citizenship”).' },
    { id: 'aclu', type: 'secondary', inst: 'American Civil Liberties Union', mla: 'American Civil Liberties Union. “The Successes of the American Civil Liberties Union.” ACLU.', url: 'https://www.aclu.org/successes-american-civil-liberties-union', use: 'The ACLU’s founding in 1920 and its view of <i>Gitlow v. New York</i> as its first Supreme Court landmark. Note: the ACLU is describing its own history.' },
    { id: 'lii-gitlow', type: 'primary', inst: 'Legal Information Institute, Cornell Law School', mla: '<i>Gitlow v. New York</i>. 268 U.S. 652, U.S. Supreme Court, 8 June 1925. Legal Information Institute, Cornell Law School.', url: 'https://www.law.cornell.edu/supremecourt/text/268/652', use: 'Verified quotations from Justice Sanford’s majority opinion and Justice Holmes’s dissent.' },
    { id: 'nara-migration', type: 'secondary', inst: 'U.S. National Archives', mla: 'National Archives. “The Great Migration (1910–1970).” <i>African American Heritage</i>, U.S. National Archives and Records Administration.', url: 'https://www.archives.gov/research/african-americans/migrations/great-migration', use: 'Scale, causes, and destinations of the Great Migration, and the discrimination migrants faced.' },
    { id: 'ohs-tulsa', type: 'secondary', inst: 'Oklahoma Historical Society', mla: '“Tulsa Race Massacre.” <i>The Encyclopedia of Oklahoma History and Culture</i>, Oklahoma Historical Society.', url: 'https://www.okhistory.org/publications/enc/entry?entry=TU013', use: 'The Tulsa Race Massacre of May 31–June 1, 1921.' },
    { id: 'naacp-dyer', type: 'secondary', inst: 'NAACP', mla: 'NAACP. “Dyer Anti-Lynching Bill.” <i>History Explained: Legislative Milestones</i>, NAACP.', url: 'https://naacp.org/find-resources/history-explained/legislative-milestones/dyer-anti-lynching-bill', use: 'The Dyer Anti-Lynching Bill: passed by the House in 1922 and blocked in the Senate.' },
    { id: 'fbi-palmer', type: 'secondary', inst: 'Federal Bureau of Investigation', mla: 'Federal Bureau of Investigation. “Palmer Raids.” <i>FBI History: Famous Cases and Criminals</i>, FBI.', url: 'https://www.fbi.gov/history/famous-cases/palmer-raids', use: 'The 1919 bombings and the Palmer Raids of the First Red Scare.' },
    { id: 'ushistory-46', type: 'secondary', inst: 'Independence Hall Association, ushistory.org', mla: 'Independence Hall Association. “The Decade That Roared.” <i>U.S. History Online Textbook</i>, ushistory.org.', url: 'https://www.ushistory.org/us/46.asp', use: 'Class starting point: the consumer economy, automobiles, radio, and cultural change in the 1920s.' },
    // --- Library of Congress photographs (all primary sources) ---
    { id: 'p-harding', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Warren G. Harding</i>. Photograph, between 1921 and 1923. Library of Congress Prints and Photographs Division, LC-USZ62-29218.', url: 'https://www.loc.gov/item/2002695720/', use: 'Portrait of President Harding (Room 2).' },
    { id: 'p-porch', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Senator Warren G. Harding, Republican Nominee for President, Posing in the Shade of His Front Porch at Marion, Ohio</i>. Photograph, 22 Oct. 1920. Library of Congress, LC-USZ62-70724.', url: 'https://www.loc.gov/item/2003654862/', use: 'Harding during the 1920 “front porch” campaign (Room 1).' },
    { id: 'p-inaug', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Harding Inauguration, March 4th, 1921</i>. Panoramic photograph, 4 Mar. 1921. Library of Congress, LC-USZ62-122406.', url: 'https://www.loc.gov/item/2007663486/', use: 'Harding’s inauguration (Room 2).' },
    { id: 'p-coolidge', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Calvin Coolidge, Head-and-Shoulders Portrait, Facing Right</i>. Photograph, c. 4 Dec. 1923. Library of Congress, LC-USZ62-13030.', url: 'https://www.loc.gov/item/96522645/', use: 'Portrait of President Coolidge (Room 4).' },
    { id: 'p-farmers', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Calvin Coolidge on the White House Lawn, with Members of the House Agricultural Committee and a Group of Western Farmers</i>. Photograph, 12 Jan. 1924. Library of Congress, LC-USZ62-110626.', url: 'https://www.loc.gov/item/94505218/', use: 'Farm delegation at the White House (Room 4).' },
    { id: 'p-taxbill', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Calvin Coolidge Signing the Income Tax Bill, Also Known as the Mellon Tax Bill</i>. Photograph, 26 Feb. 1926. Library of Congress, LC-USZ62-110627.', url: 'https://www.loc.gov/item/94505220/', use: 'Signing of the Revenue Act of 1926 (Room 4).' },
    { id: 'p-fall', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: 'National Photo Company. <i>Albert B. Fall</i>. Glass negative, 1921. Library of Congress, LC-DIG-npcc-03798.', url: 'https://www.loc.gov/item/2016830028/', use: 'Interior Secretary Albert B. Fall (Room 3).' },
    { id: 'p-sinclair', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: 'Harris & Ewing. <i>Harry F. Sinclair, Multimillionaire Oil Magnate (Left) and His Counsel Martin W. Littleton. Teapot Dome Hearing</i>. Glass negative, 1924. Library of Congress, LC-DIG-hec-44031.', url: 'https://www.loc.gov/item/2016893277/', use: 'Sinclair at the Senate hearings (Room 3).' },
    { id: 'p-doheny', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Edward L. Doheny and His Lawyer Frank J. Hogan</i>. Photograph, 1 Feb. 1924. Library of Congress, LC-USZ62-51321.', url: 'https://www.loc.gov/item/2002695652/', use: 'Doheny during the investigation (Room 3).' },
    { id: 'p-dawes', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Charles Dawes</i>. Photograph, c. 1924. Library of Congress, LC-USZ6-849.', url: 'https://www.loc.gov/item/2002723307/', use: 'Charles G. Dawes (Room 5).' },
    { id: 'p-naval', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: 'Harris & Ewing. <i>[The Conference on Limitation of Armaments, Washington, D.C.]</i>. Glass negative, 1921 or 1922. Library of Congress, LC-DIG-hec-31562.', url: 'https://www.loc.gov/item/2016886511/', use: 'The Washington Naval Conference in session (Room 5).' },
    { id: 'p-ellis', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Immigrants at Ellis Island</i>. Photograph, between 1907 and 1917. Library of Congress, LC-USZ62-26543.', url: 'https://www.loc.gov/item/97501640/', use: 'Immigrants at Ellis Island before the quota laws (Room 6).' },
    { id: 'p-mellon', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Mellon, Andrew, Portrait Photograph</i>. 26 Nov. 1924. Library of Congress, LC-G412-T-4559.', url: 'https://www.loc.gov/item/2018714243/', use: 'Treasury Secretary Andrew Mellon (Room 4).' },
    { id: 'p-teapot', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: 'Highsmith, Carol M. <i>Teapot Rock, a Distinctive Sedimentary Rock Formation in Natrona County, Wyoming</i>. Digital photograph, 29 May 2016. Carol M. Highsmith Archive, Library of Congress, LC-DIG-highsm-38168.', url: 'https://www.loc.gov/item/2017688060/', use: 'Modern photograph of the rock that gave Teapot Dome its name (Room 3). Primary source for the landscape today, not for 1922.' },
    { id: 'p-rail', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Guards on Duty during the Railroad Strike</i>. Photograph, 10 Aug. 1922. Library of Congress, LC-USZ62-96759.', url: 'https://www.loc.gov/item/89709484/', use: 'The 1922 railroad strike (Room 2).' },
    { id: 'p-steel', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>Strike Leader at Gary, Ind., Advising Strikers</i>. Photograph, 1919. Library of Congress, LC-USZ62-77539.', url: 'https://www.loc.gov/item/2002695621/', use: 'The 1919 steel strike (Room 1).' },
    { id: 'p-parade', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: '<i>[Large Parade; Welcoming Armed Forces Home. Buffalo, N.Y., 1919]</i>. Photograph, c. 1919. Library of Congress, LC-USZ62-29645.', url: 'https://www.loc.gov/item/2013648114/', use: 'Demobilization and homecoming after World War I (Room 1).' },
    { id: 'p-rouge', type: 'primary', inst: 'Library of Congress, Prints & Photographs', mla: 'Detroit Publishing Company. <i>[Ford Motor Company River Rouge Plant, Dearborn, Air View]</i>. Photograph, 1927?. Library of Congress, LC-DIG-det-4a25915.', url: 'https://www.loc.gov/item/2016800582/', use: 'Industrial mass production in the 1920s (Room 2).' },
  ];

  /* -------------------------------------------------------------------
     6. ROOMS (order = suggested visiting order)
     ------------------------------------------------------------------- */
  const ROOMS = {
    r1: {
      num: 1, title: 'The Aftermath of World War I', building: 'Union Station', color: '#7a3a2e',
      question: 'Why did Americans want a return to normalcy?',
      blurb: 'A crowded station in 1919–1920: soldiers coming home, prices rising, strikes spreading, and a candidate promising calm.',
      narration: [
        "Picture this station in 1919. The war is over and trains are bringing soldiers home — but home doesn't feel calm.",
        "Factories that ran on war orders are slowing down. Prices jumped during the war, and then the economy crashed into a sharp depression in 1920 and 1921. Wages dropped and more than twenty thousand businesses failed.",
        "Workers went on strike all over the country — in Seattle, in the steel mills, even the Boston police. After a string of bombings in 1919, many Americans feared a communist revolution, and the government arrested thousands of suspected radicals in the Palmer Raids.",
        "And President Wilson's fight to join the League of Nations ended in defeat in the Senate.",
        "So when Senator Warren G. Harding said America needed “not heroics but healing… not revolution but restoration,” a lot of tired voters listened. In November 1920 he won about sixty percent of the popular vote.",
        "But remember: not every American wanted the same thing from “normalcy,” and the problems in this room did not disappear on election day. Let's follow Harding to the White House and see what normalcy looked like in practice.",
      ],
      docent: { name: 'Station Master Ruth', look: 'stationmaster', lines: [
        'Welcome to Union Station, 1919–1920. Trains bring soldiers home — and a lot of worries with them.',
        'Look for the glowing exhibits. The gramophone plays Harding’s actual 1920 recording when you are online.',
        'When you are ready, try the ticket window: “Restore Stability” is a historical simulation, not a guessing game.',
        'Press N any time for my colleague’s narration of this room. The exit mat is at the bottom of the hall.'] },
    },
    r2: {
      num: 2, title: 'Inside Harding’s White House', building: 'The White House', color: '#2c4a6a',
      question: 'What did normalcy mean for government and business?',
      blurb: 'Harding’s office, 1921–1923: budgets, tariffs, tax cuts — and tense battles between business and labor.',
      narration: [
        "Welcome to Warren Harding's White House. He served from March 1921 until he died in August 1923.",
        "It's easy to think “normalcy” meant the government simply did nothing. That's not quite right. Harding's government made deliberate choices.",
        "In 1921 he signed the Budget and Accounting Act, which made the president send Congress one complete federal budget every year and created an independent office to audit government spending.",
        "His Treasury Secretary, Andrew Mellon, pushed tax cuts, starting with the Revenue Act of 1921. And in 1922 the Fordney-McCumber Tariff raised taxes on imported goods to protect American manufacturers.",
        "Supporters said these policies would build business confidence and bring back prosperity. Critics said they helped the wealthy and big industry most.",
        "Labor felt that tension directly. When around four hundred thousand railroad shop workers went on strike in 1922, Harding's attorney general won a sweeping court order against them.",
        "So normalcy was a set of choices about who government should help, and how. Next, let's see what happened when some officials used public power for private gain.",
      ],
      docent: { name: 'Usher Mr. Amos', look: 'usher', lines: [
        'Good evening. This is the President’s office as it might have looked in 1921–1923.',
        'Three documents sit on the desk — each is a real law. Read the actual wording in the archive files.',
        'The wall on the right shows business and labor side by side. Compare the two perspectives.',
        'The cabinet table hosts “The President’s Policy Desk.” Match each policy to its purpose and the people it affected.'] },
    },
    r3: {
      num: 3, title: 'The Teapot Dome Scandal', building: 'The Daily Ledger', color: '#4a3a2a',
      question: 'What happens when public office serves private interests?',
      blurb: 'A late-night newsroom. Evidence pinned to the wall. Your assignment: separate proof from rumor.',
      narration: [
        "Grab a notebook, reporter — something smells like oil.",
        "Before the war, the government set aside oil fields as an emergency fuel supply for the Navy — one at Elk Hills in California, and one under a rock formation in Wyoming called Teapot Dome.",
        "In 1921, President Harding moved control of these reserves from the Navy to the Interior Department, run by Secretary Albert B. Fall.",
        "Fall then leased the reserves to two oilmen, Harry Sinclair and Edward Doheny — secretly, and without competitive bidding. Around the same time, Fall suddenly had a lot of money.",
        "In April 1922, the Wall Street Journal reported the Teapot Dome lease, and the Senate opened an investigation. Senator Thomas Walsh asked the key question: how did Fall get so rich so quickly?",
        "The answer included a one-hundred-thousand-dollar “loan” from Doheny. In 1929, Fall was convicted of accepting a bribe — the first former cabinet officer to go to prison.",
        "Here's the careful part: Harding died in 1923, before most of this came out, and there's no evidence he took oil bribes himself. Good reporting separates proof from rumor.",
        "So ask yourself: what safeguards should stop officials from using public resources for private gain?",
      ],
      docent: { name: 'Night Editor Gus', look: 'editor', lines: [
        'Welcome to the Ledger’s night desk. Every clipping on that wall is evidence — label it before you trust it.',
        'Primary sources were created at the time. Secondary sources explain it afterward. Both matter.',
        'Harding died in August 1923, before the scandal fully broke. Don’t print what you can’t prove.',
        'My desk has the case file — “Solve the Teapot Dome Case.” Build the timeline and judge the evidence.'] },
    },
    r4: {
      num: 4, title: 'The Age of Calvin Coolidge', building: 'Treasury & Press Hall', color: '#3a5a3a',
      question: 'Was quiet government good government?',
      blurb: 'The presidential press room, 1923–1929: a quiet president, booming businesses, and farmers left behind.',
      narration: [
        "On August 3rd, 1923, Calvin Coolidge became president after Harding's sudden death. He won a full term in 1924 and served until March 1929.",
        "People called him “Silent Cal,” but he wasn't absent. He held more than five hundred press conferences and spoke on the radio regularly. He chose his words carefully, and his image was calm, honest, and thrifty.",
        "Coolidge believed in a limited federal government. With Treasury Secretary Andrew Mellon, he cut income taxes several times, ran budget surpluses, and paid down the national debt.",
        "Supporters credited these policies for the boom — cars, radios, electric appliances, and rising stock prices.",
        "But prosperity was uneven. Farmers struggled with low crop prices all decade, and Coolidge twice vetoed the McNary-Haugen farm bills meant to help them. Many people also bought stocks and goods on credit.",
        "The Great Depression began after Coolidge left office, and historians still debate how much the policies of the 1920s contributed. Growth and limited government defined this era — but prosperity did not reach every American equally.",
      ],
      docent: { name: 'Press Secretary Mae', look: 'flapper', lines: [
        'Settle in — the President’s press conference is about to begin. He will not say much. He never does.',
        'Notice two newspapers here: one shows how Coolidge responded to the oil scandal in 1924.',
        'Compare the farm display with the stock ticker. Did everyone share in “Coolidge Prosperity”?',
        'The adviser’s desk holds “Balancing the Budget.” It is a simplified model — the rules are shown up front.'] },
    },
    r5: {
      num: 5, title: 'America and the World', building: 'Hall of Nations', color: '#5a3a6a',
      question: 'Was America really turning inward?',
      blurb: 'A diplomatic chamber where money, treaties, and warships connect the United States to Europe and Asia.',
      narration: [
        "It's often said that after World War One, America turned its back on the world. The United States never joined the League of Nations — the Senate rejected the Treaty of Versailles in 1919.",
        "But follow the money and the story gets more complicated.",
        "During the war, the U.S. lent the Allies more than ten billion dollars, and Washington expected to be repaid. Meanwhile, Germany owed huge reparations to Britain and France.",
        "In 1923, Germany fell behind on payments, France occupied the Ruhr valley, and German money collapsed. In 1924, the Dawes Plan — led by American banker Charles Dawes — reduced Germany's payments and arranged a big international loan.",
        "For about four years, American banks lent money to Germany, Germany paid reparations to the Allies, and the Allies paid their war debts back to the United States. It worked — as long as American loans kept flowing.",
        "The U.S. also led the Washington Naval Conference to limit warships, and helped create the Kellogg-Briand Pact to renounce war — though neither could be enforced.",
        "So normalcy didn't mean America had no international responsibilities. It meant choosing which ones to accept.",
      ],
      docent: { name: 'Envoy Mr. Lindqvist', look: 'diplomat', lines: [
        'Welcome to the Hall of Nations. Watch the great map — the gold lines show money moving across the Atlantic.',
        'The U.S. stayed out of the League of Nations, but American banks, diplomats, and treaties were everywhere.',
        'The map table holds “Repair the International Economy.” It is a simplified model, clearly labeled.',
        'Ask yourself: is signing a promise the same as enforcing it?'] },
    },
    r6: {
      num: 6, title: 'Normalcy for Whom?', building: 'Community Hall', color: '#6a5a2a',
      question: 'Did everyone benefit from America’s return to normalcy?',
      blurb: 'A quiet reading room of laws, court cases, and lives — testing whether “normal” included everyone.',
      narration: [
        "So far we've looked at presidents, policies, and money. Now let's ask a harder question: normalcy for whom?",
        "In 1921 and again in 1924, Congress passed laws that sharply limited immigration. The 1924 law used quotas based on the 1890 census, which favored immigrants from northern and western Europe, cut visas for southern and eastern Europeans, and barred almost all immigration from Asia, including Japan.",
        "Fear of radicals also shaped this era. Benjamin Gitlow was convicted in New York for publishing a socialist manifesto. In 1925 the Supreme Court upheld his conviction — but it also said free speech is protected from state governments, not just Congress. He lost, but the Constitution grew.",
        "And for many Black Americans, the twenties brought both new opportunities in Northern cities through the Great Migration and terrible violence, like the Tulsa Race Massacre of 1921. A federal anti-lynching bill passed the House in 1922 but died in the Senate.",
        "Normalcy was a political ideal, not one shared experience.",
        "So here's the question to carry into the courthouse: can a country truly return to normal if its definition of normal excludes or disadvantages some of its people?",
      ],
      docent: { name: 'Librarian Mrs. Okafor', look: 'librarian', lines: [
        'Welcome to the reading room. Please handle these stories with care — they are about real people.',
        'The profile table holds “Who Experienced Normalcy?” The profiles are labeled composites, built from real laws and events.',
        'There is no score for empathy. The goal is to connect each life to the policies that shaped it.',
        'When you are finished, the Courthouse in the southwest corner of town will hear your verdict.'] },
    },
    court: {
      num: 7, title: 'Judge Normalcy', building: 'Courthouse', color: '#3a2a2a',
      question: 'Did America’s return to normalcy succeed?',
      blurb: 'Weigh the evidence you gathered and deliver your verdict.',
      docent: { name: 'Clerk of Court Mr. Bell', look: 'clerk', lines: [
        'Order in the court! Step up to the bench when you are ready to deliver your verdict.',
        'There is no single right answer here — but every verdict must be supported by evidence.',
        'Pick at least two pieces of evidence from the museum. The court will tell you what supports your case and what complicates it.'] },
    },
    library: {
      num: 8, title: 'The Reference Library', building: 'Public Library', color: '#2a3a4a',
      question: 'Where does the evidence come from?',
      blurb: 'Every source, script, and credit — the museum’s paper trail.',
      docent: { name: 'Archivist Miss Ida', look: 'archivist', lines: [
        'Shh — welcome to the archive. Every quotation, photograph, and claim in the museum traces back to a source on these shelves.',
        'The card catalog holds the full bibliography in MLA style. You can copy it for a Word document.',
        'The projector replays the help-desk introduction. The plaque by the door lists our team.',
        'The Essential Questions board shows where each big question appears in the museum.'] },
    },
  };

  /* -------------------------------------------------------------------
     7. ARTIFACTS
     type: 'primary' | 'secondary' | 'illustration' | 'composite'
     media kinds: image, audio, newspaper, diagram, timeline, map, board, compare
     ------------------------------------------------------------------- */
  const IMG = 'assets/archive/';
  const ARTIFACTS = {
    /* ================= ROOM 1 ================= */
    r1_recording: {
      room: 'r1', title: 'Harding’s “Readjustment” Recording', date: 'Recorded June 29, 1920', creator: 'Warren G. Harding (speaker); Columbia Graphophone Co. for the Nation’s Forum',
      type: 'primary', eq: ['D1'],
      media: { kind: 'audio', src: MEDIA.hardingRecording, img: IMG + 'harding_porch.jpg', imgCaption: 'Senator Harding on his front porch in Marion, Ohio, Oct. 22, 1920 (Library of Congress).', note: 'Streams the original 78-rpm disc from the Library of Congress (4 min 22 s). Requires an internet connection. The Library notes these recordings were mostly re-creations of earlier speeches.' },
      excerpt: { text: '“America’s present need is not heroics but healing; not nostrums but normalcy; not revolution but restoration; not agitation but adjustment; not surgery but serenity; not the dramatic but the dispassionate; not experiment but equipoise; not submergence in internationality but sustainment in triumphant nationality.”', by: 'Warren G. Harding, “Readjustment” — wording as transcribed in the Library of Congress catalog record' },
      background: [
        'In 1920, before radio was common, candidates recorded speeches on phonograph discs. The Library of Congress calls 1920 the last campaign made accessible to the public solely through record albums.',
        'Harding, an Ohio newspaper publisher and U.S. senator, first used these lines in a May 1920 speech in Boston and re-recorded them for the Nation’s Forum in June. “Normalcy” was an unusual word — but it stuck.',
      ],
      why: 'The speech defines what Harding offered: calm instead of crusades, restoration instead of reform, and national focus instead of international commitments like the League of Nations. Notice every “not…but” pair rejects something associated with Wilson’s wartime presidency.',
      question: 'Pick two of Harding’s “not… but…” pairs. What fear or frustration from 1919–1920 is each pair answering?',
      thinking: '“Not revolution but restoration” speaks to Red Scare fears; “not submergence in internationality” speaks to the League of Nations fight; “not experiment” pushes back against Progressive-era and wartime government programs.',
      sources: ['loc-readjust', 'loc-1920', 'p-porch'],
    },
    r1_herald: {
      room: 'r1', title: 'Front Page: “Harding Elected by Overwhelming Vote”', date: 'November 3, 1920', creator: 'The New York Herald',
      type: 'primary', eq: ['D1'],
      media: { kind: 'newspaper', src: IMG + 'news_herald_1920.jpg', caption: 'The New York Herald, Nov. 3, 1920, page 1. Digitized by the Library of Congress (Chronicling America). Scroll or use the + button to zoom.' },
      background: [
        'The morning after Election Day 1920, newspapers announced a landslide. Harding and his running mate, Massachusetts governor Calvin Coolidge, defeated Democrats James M. Cox and Franklin D. Roosevelt, winning about 60 percent of the popular vote.',
        '1920 was also the first presidential election after the Nineteenth Amendment guaranteed women the right to vote, and the first whose returns were broadcast by commercial radio.',
      ],
      why: 'The size of the victory shows how strongly many voters wanted change after the war years. The headline also notes Republican gains in Congress — Harding would have allies to pass his program.',
      question: 'Zoom into the headlines. Besides Harding’s win, what other changes does the paper report? Why might a big margin matter for a new president?',
      thinking: 'The page reports Republicans tightening control of the Senate and Wilson’s 1916 majorities overturned in many cities — signs of a broad rejection of the party in power.',
      sources: ['herald-1920', 'loc-1920'],
    },
    r1_parade: {
      room: 'r1', title: 'Welcome Home: Demobilization, 1919', date: 'c. 1919', creator: 'Photographer unknown; Library of Congress',
      type: 'primary', eq: ['D1'],
      media: { kind: 'image', src: IMG + 'parade_1919.jpg', caption: 'Large parade welcoming armed forces home, Buffalo, New York, c. 1919 (Library of Congress, LC-USZ62-29645).' },
      background: [
        'After the armistice of November 1918, millions of soldiers came home within months. Wartime factories lost their government orders, and returning veterans looked for jobs.',
        'Prices had risen sharply during the war. Then, in 1920–21, a sharp depression hit: wages dropped and more than 20,000 businesses failed.',
      ],
      why: 'Celebrations like this parade sit beside economic anxiety. The shift from war to peace was exciting and unsettling at the same time — exactly the mood Harding’s promise of “healing” spoke to.',
      question: 'This photo shows celebration. What does it NOT show about life for returning soldiers? What other sources would you need?',
      thinking: 'It cannot show jobs, wages, prices, or the experiences of veterans who faced discrimination — you would need economic data, letters, or newspapers.',
      sources: ['p-parade', 'miller-harding'],
    },
    r1_strike: {
      room: 'r1', title: 'The Steel Strike of 1919', date: '1919', creator: 'Photographer unknown; Library of Congress',
      type: 'primary', eq: ['A1', 'D1'],
      media: { kind: 'image', src: IMG + 'steel_strike.jpg', caption: '“Strike leader at Gary, Ind., advising strikers,” 1919 (Library of Congress, LC-USZ62-77539).' },
      background: [
        '1919 brought waves of strikes: a general strike in Seattle, a nationwide steel strike, and a strike by Boston police officers. Workers wanted wages to keep up with wartime price increases and wanted their unions recognized.',
        'During the Boston police strike, Massachusetts governor Calvin Coolidge telegraphed labor leader Samuel Gompers: “There is no right to strike against the public safety by anyone, anywhere, any time.” The telegram made Coolidge nationally famous.',
      ],
      why: 'Many Americans connected strikes with radicalism and disorder. That fear helped make “normalcy” attractive — and helped put Coolidge on the 1920 ticket. For workers, though, “normal” could mean lower wages and weaker unions.',
      question: 'How might a striking steelworker and a factory owner each define “getting back to normal” in 1919?',
      sources: ['p-steel', 'loc-1920'],
    },
    r1_redscare: {
      room: 'r1', title: 'Timeline: A Year of Upheaval, 1919–1920', date: 'Created for this museum', creator: 'Museum research team (secondary source)',
      type: 'secondary', eq: ['A2', 'D1'],
      media: { kind: 'timeline', items: [
        ['Nov. 1918', 'Armistice ends the fighting in World War I.'],
        ['1919', 'Strikes in Seattle, the steel industry, and the Boston police force.'],
        ['1919', 'A series of bombings targets officials, including Attorney General A. Mitchell Palmer’s home.'],
        ['Nov. 19, 1919', 'The Senate rejects the Treaty of Versailles — and with it, U.S. membership in the League of Nations.'],
        ['Nov. 1919 – Jan. 1920', 'The Palmer Raids: federal agents arrest thousands of suspected radicals, many of them immigrants.'],
        ['1920–1921', 'A sharp postwar depression: wages fall and more than 20,000 businesses fail.'],
        ['Nov. 2, 1920', 'Harding wins the presidency in a landslide.'],
      ] },
      background: [
        'The First Red Scare grew out of the 1917 Russian Revolution, wartime pressure for loyalty, and the 1919 bombings. Many people arrested in the Palmer Raids were held without proper legal process, and critics — including some government lawyers — condemned the raids.',
        'At the same time, President Wilson refused to compromise with Senate Republicans over the League of Nations. The Senate rejected the treaty in November 1919, the first time it had ever rejected a peace treaty.',
      ],
      why: 'Fear of radicals, frustration with international commitments, and economic pain all pushed many voters toward a promise of calm. These same fears would later shape immigration laws and free-speech cases — see Room 6.',
      question: 'Which event on this timeline do you think did the most to make “normalcy” appealing? Defend your choice with evidence.',
      sources: ['fbi-palmer', 'senate-versailles', 'ohs-league', 'miller-harding'],
    },

    /* ================= ROOM 2 ================= */
    r2_budget: {
      room: 'r2', title: 'The Budget and Accounting Act, 1921', date: 'Signed June 10, 1921', creator: 'U.S. Congress; signed by President Harding',
      type: 'primary', eq: ['A1', 'C1'],
      media: { kind: 'document', heading: 'An Act To provide a national budget system and an independent audit of Government accounts, and for other purposes.', lines: [
        ['Sec. 201.', '“The President shall transmit to Congress on the first day of each regular session, the Budget…”'],
        ['Sec. 207.', '“There is hereby created in the Treasury Department a Bureau to be known as the Bureau of the Budget.”'],
        ['Sec. 301.', '“There is created an establishment of the Government to be known as the General Accounting Office, which shall be independent of the executive departments…”'],
      ], foot: 'Verified from the Statutes at Large, 42 Stat. 20 (GovInfo). Excerpts — the full law is eight pages.' },
      background: [
        'Before 1921, each federal agency sent its own spending requests to Congress. There was no single national budget.',
        'This law required the president to submit one complete budget every year, created the Bureau of the Budget to prepare it, and created the General Accounting Office to audit spending independently. Charles G. Dawes — who appears again in Room 5 — became the first budget director.',
      ],
      why: 'This was not “doing nothing.” Harding used federal power to make government more businesslike and economical — a key part of his vision of normalcy. It also created lasting accountability: the GAO still audits federal spending today (now as the Government Accountability Office).',
      question: 'Why might an independent auditor (the GAO) matter for public trust? Connect your answer to what happens in Room 3.',
      sources: ['stat-budget', 'miller-harding'],
    },
    r2_revenue: {
      room: 'r2', title: 'The Revenue Act of 1921', date: 'Signed November 23, 1921', creator: 'U.S. Congress; championed by Treasury Secretary Andrew Mellon',
      type: 'primary', eq: ['C1', 'D2'],
      media: { kind: 'document', heading: 'An Act To reduce and equalize taxation, to provide revenue, and for other purposes.', lines: [
        ['Title', '“That this Act may be cited as the ‘Revenue Act of 1921.’”'],
        ['Effect', 'Top income-tax rate: 73% in 1921 → 58% beginning in 1922. Repealed the wartime excess-profits tax on businesses.'],
        ['Later', 'Mellon-backed laws in 1924 and 1926 cut the top rate further — to 25% by 1925.'],
      ], foot: 'Title and date verified from 42 Stat. 227 (GovInfo). Rates summarized from the Cato Journal (secondary).' },
      background: [
        'World War I was paid for partly with very high income taxes on the wealthy and special taxes on business profits. Andrew Mellon, one of the richest men in America, became Treasury Secretary in 1921 and argued that high rates discouraged investment.',
        'The Revenue Act of 1921 began a decade of tax cuts. Under Harding, it lowered the top rate and ended the excess-profits tax. Under Coolidge, the Revenue Acts of 1924 and 1926 went further.',
      ],
      why: 'Interpretations clash. The Cato Institute argues the tax cuts encouraged growth and even raised revenue. The Miller Center notes that by 1926 a person earning $1 million paid less than a third of the income tax they paid in 1920, and describes the policy as tax cuts mainly for the rich and for corporations. Both describe the same facts — they disagree about who benefited and why it mattered.',
      question: 'Read both interpretations. What evidence would you need to decide which one is more convincing?',
      sources: ['stat-revenue', 'cato-tax', 'miller-harding', 'treasury-mellon'],
    },
    r2_tariff: {
      room: 'r2', title: 'The Fordney-McCumber Tariff, 1922', date: 'Signed September 21, 1922', creator: 'U.S. Congress (Rep. Joseph Fordney, Sen. Porter McCumber)',
      type: 'primary', eq: ['C1', 'D1'],
      media: { kind: 'document', heading: 'Tariff Act of 1922 — Section 315 (“flexible tariff”)', lines: [
        ['Sec. 315(a)', '“…in order to regulate the foreign commerce of the United States and to put into force and effect the policy of the Congress by this Act intended, whenever the President, upon investigation of the differences in costs of production… shall find it thereby shown that the duties fixed in this Act do not equalize the said differences in costs of production…”'],
        ['TIME, 1923', 'The President “may raise or lower duties (not more than 50% of the amount fixed by law)” on the Tariff Commission’s recommendation.'],
      ], foot: 'Verified from 42 Stat. 858 (GovInfo) and TIME, April 28, 1923. Excerpt of a long sentence.' },
      background: [
        'A tariff is a tax on imported goods. Higher tariffs make foreign products more expensive, protecting American manufacturers from competition. Harding had promised higher tariffs during the 1920 campaign.',
        'The Fordney-McCumber Tariff reversed the lower rates of the Wilson years. Its “flexible” section let the president raise or lower rates by up to half, after the Tariff Commission compared production costs at home and abroad.',
      ],
      why: 'The tariff shows normalcy’s pro-business side: protecting industry and workers in protected factories. But it also raised prices for consumers and made it harder for Europeans to sell goods in America — and earn the dollars they needed to repay their war debts (see Room 5).',
      question: 'Who gains and who loses when a tariff rises? List one winner and one loser, and explain.',
      thinking: 'Winners: protected manufacturers and their workers. Losers: consumers paying higher prices, farmers who sold abroad and faced retaliation, and foreign countries trying to earn dollars.',
      sources: ['stat-tariff', 'time-1923', 'miller-harding'],
    },
    r2_harding: {
      room: 'r2', title: 'President Warren G. Harding, 1921–1923', date: 'Photographs, 1921–1923', creator: 'Library of Congress, Prints & Photographs Division',
      type: 'primary', eq: ['D1', 'D2'],
      media: { kind: 'image', src: IMG + 'harding.jpg', caption: 'Warren G. Harding, between 1921 and 1923 (Library of Congress, LC-USZ62-29218).', extra: { src: IMG + 'harding_inaug.jpg', caption: 'Harding’s inauguration, March 4, 1921 (panoramic photograph, Library of Congress).' } },
      background: [
        'Harding was friendly and popular. He appointed some highly respected cabinet members — Charles Evans Hughes at State, Andrew Mellon at Treasury, Herbert Hoover at Commerce — but also friends from Ohio, the so-called “Ohio Gang,” some of whom were later charged with defrauding the government.',
        'He also made choices that cut against the Red Scare: in December 1921 he commuted the prison sentence of socialist leader Eugene V. Debs. In October 1921, speaking in Birmingham, Alabama, he publicly criticized the unfair treatment of Black Americans — unusual for a president at the time.',
        'Harding died suddenly in San Francisco on August 2, 1923, while on a speaking tour.',
      ],
      why: 'Harding’s reputation is complicated. Historians have often ranked him poorly because of the scandals in his administration, while others point to his budget reform, his release of Debs, and his civil-rights speech. Evaluating a president means weighing all of it.',
      question: 'Is it fair to judge a president by the actions of the people he appointed? Why or why not?',
      sources: ['p-harding', 'p-inaug', 'miller-harding'],
    },
    r2_wall: {
      room: 'r2', title: 'Business & Labor: Two Views of Normalcy', date: '1922–1927', creator: 'Library of Congress photographs; interpretations from the Miller Center and Dictionary of American History',
      type: 'primary', eq: ['A1', 'D2'],
      media: { kind: 'compare', left: { src: IMG + 'river_rouge.jpg', title: 'Industry booms', caption: 'Ford Motor Company’s River Rouge plant, Dearborn, Michigan, c. 1927 (Detroit Publishing Co., Library of Congress).' }, right: { src: IMG + 'rail_strike.jpg', title: 'Labor pushes back', caption: 'Guards on duty during the railroad strike, Aug. 10, 1922 (Library of Congress).' } },
      background: [
        'Mass production made the 1920s boom possible. Huge plants like Ford’s River Rouge turned out cars that ordinary families could afford, and new industries grew around them.',
        'Labor saw a different side. On July 1, 1922, roughly 400,000 railroad shop workers walked off the job after unfavorable rulings by the federal Railroad Labor Board. Attorney General Harry Daugherty obtained what one reference work calls “a sweeping injunction against the strikers and their leadership.” The strike was settled in October 1922, largely in favor of the railroads.',
      ],
      why: 'For business leaders, normalcy meant stable government, low taxes, and order. For many workers, it meant courts and federal officials siding with employers. The same era looks very different depending on where you stood.',
      question: 'Compare the two photographs. What does each suggest about who government served in the early 1920s? What can a photograph NOT tell you?',
      sources: ['p-rouge', 'p-rail', 'dah-rail', 'miller-harding'],
    },

    /* ================= ROOM 3 ================= */
    r3_board: {
      room: 'r3', title: 'The Evidence Board', date: '1912–1929', creator: 'Assembled by the museum from primary and secondary sources',
      type: 'secondary', eq: ['A1', 'C1'],
      media: { kind: 'board', items: [
        { t: 'Timeline: the transfer', type: 'secondary', d: 'The Navy’s oil reserves at Elk Hills, California, and Teapot Dome, Wyoming, were set aside before World War I as emergency fuel for warships. In 1921, an executive order by President Harding transferred control of the reserves from the Navy Department to the Interior Department, headed by Albert B. Fall.', src: 'miller-harding' },
        { t: 'The leases', type: 'secondary', d: 'In 1922, Fall leased Teapot Dome to Harry Sinclair’s Mammoth Oil Company and Elk Hills to Edward Doheny’s Pan American Petroleum. According to the U.S. Senate, the Teapot Dome lease was made “without competitive bidding.”', src: 'senate-td' },
        { t: 'Senate investigation', type: 'secondary', d: 'On April 14, 1922, the Wall Street Journal reported the secret Teapot Dome lease. The next day, Wyoming senator John Kendrick introduced a resolution that began “one of the most significant investigations in Senate history.” Montana senator Thomas Walsh led the inquiry.', src: 'senate-td' },
        { t: 'Newspaper, Jan. 25, 1924', type: 'primary', d: 'Washington’s Evening Star headline: “SINCLAIR MADE FALL $25,000 LOAN, PROBE REVEALS.” Newspapers across the country followed every twist of the hearings. (Open the newspaper on the editor’s desk to read the full page.)', src: 'star-1924a' },
        { t: 'Profile: Albert B. Fall', type: 'primary', d: 'Former New Mexico senator, Interior Secretary 1921–1923. Walsh’s central question: “How did Interior Secretary Albert Fall get so rich so quickly?” Investigators found a $100,000 “loan” from Doheny. Fall was convicted of accepting a bribe on Oct. 25, 1929, and sentenced to one year in prison and a $100,000 fine.', src: 'history-fall', img: IMG + 'fall.jpg' },
        { t: 'Diagram: the connection', type: 'secondary', d: 'PUBLIC RESOURCE (Navy oil) → GOVERNMENT AUTHORITY (Interior Secretary’s leases) → PRIVATE INTERESTS (Sinclair & Doheny) → MONEY back to the official. When public power is traded for private gain, that is corruption.', src: 'senate-td' },
      ] },
      background: [
        'Click each item on the board to read it. Look at the label: primary sources were created at the time; secondary sources explain events afterward.',
        'The Teapot Dome investigation also changed constitutional law. In McGrain v. Daugherty (1927), the Supreme Court explicitly established Congress’s right to compel witnesses to testify before its committees.',
      ],
      why: 'Teapot Dome became a lasting symbol of government corruption. It also shows accountability working — a free press and a Senate investigation exposed the deals, the courts cancelled the leases, and a cabinet officer went to prison.',
      question: 'Which institutions — press, Congress, courts — did the most to expose the scandal? Which do you think matters most today?',
      sources: ['senate-td', 'miller-harding', 'history-fall', 'star-1924a', 'p-fall'],
    },
    r3_map: {
      room: 'r3', title: 'Map: The Naval Oil Reserves', date: 'Reserves set aside 1912–1915', creator: 'Modern illustration for this museum + 2016 photograph (Library of Congress)',
      type: 'illustration', eq: ['C1', 'A1'],
      media: { kind: 'map', img: IMG + 'teapot_rock.jpg', imgCaption: 'Teapot Rock, Natrona County, Wyoming — the formation that named the oil field. Photograph by Carol M. Highsmith, 2016 (Library of Congress). A modern photo, not a 1920s one.' },
      background: [
        'In the early 1900s, the U.S. Navy was switching its warships from coal to oil. To make sure the fleet would never run out of fuel in a war, the government set aside oil-rich public lands as Naval Petroleum Reserves — including Elk Hills in California and Teapot Dome in Wyoming.',
        'Oil left underground was a strategic resource: unused today, but available in an emergency. Leasing it to private companies meant someone would profit now.',
      ],
      why: 'This is a scarce-resource problem. Should public resources be saved for national needs, or developed by private businesses for profit and jobs? Either choice can be defended — but the decision must be made openly and fairly, not in secret for a bribe.',
      question: 'If you were in charge of the reserves, would you lease them? What rules would you require to keep the process honest?',
      sources: ['senate-td', 'miller-harding', 'p-teapot'],
    },
    r3_newspaper: {
      room: 'r3', title: 'Front Page: “Sinclair Made Fall $25,000 Loan”', date: 'January 25, 1924', creator: 'Evening Star (Washington, D.C.)',
      type: 'primary', eq: ['A1'],
      media: { kind: 'newspaper', src: IMG + 'news_star_1924_01_25.jpg', caption: 'Evening Star, Jan. 25, 1924, page 1 (Library of Congress, Chronicling America). Note the political cartoon in the center and the column “Former Secretary Is Silent as to Leases.”' },
      background: [
        'By January 1924, the Senate hearings were front-page news. Witnesses revealed money flowing from oilmen to Fall, and Fall refused to explain.',
        'Newspapers were the main way the public learned about the scandal. Some reporting was careful; some was sensational. That is why historians compare multiple newspapers and check them against official records.',
      ],
      why: 'This page is evidence of what the public was being told in 1924 — and of how the scandal hurt trust in government. It is not, by itself, proof of every claim it reports.',
      question: 'What is the difference between “the newspaper reported X” and “X happened”? How would you confirm this headline?',
      thinking: 'Check it against the Senate hearing records, court records, and other newspapers. A headline shows what was alleged and reported at that moment.',
      sources: ['star-1924a', 'senate-td'],
    },
    r3_fall: {
      room: 'r3', title: 'The Oilmen: Sinclair and Doheny', date: '1924', creator: 'Harris & Ewing and other photographers; Library of Congress',
      type: 'primary', eq: ['A1'],
      media: { kind: 'image', src: IMG + 'sinclair.jpg', caption: 'Harry F. Sinclair (left) with his lawyer at the Teapot Dome hearing, 1924 (Harris & Ewing, Library of Congress).', extra: { src: IMG + 'doheny.jpg', caption: 'Edward L. Doheny (left) and his lawyer Frank J. Hogan, Feb. 1, 1924 (Library of Congress).' } },
      background: [
        'Edward Doheny, head of Pan American Petroleum, gave Fall $100,000 — which both men called a “loan” — and received the Elk Hills lease. Harry Sinclair, head of Mammoth Oil, received the Teapot Dome lease; his companies also transferred bonds and cash to Fall.',
        'In 1927, the Supreme Court cancelled the leases and returned the oil fields to the government. In a strange outcome, Fall was convicted of accepting a bribe from Doheny in 1929, but Doheny was acquitted of giving it in 1930. Sinclair served time in jail for contempt — including refusing to answer the Senate’s questions.',
      ],
      why: 'Corruption needs two sides: officials willing to sell public power, and private interests willing to pay. The uneven verdicts show how hard it can be to prove bribery in court — even when the money trail is clear.',
      question: 'Why might it be harder to convict the person who pays a bribe than the official who accepts it?',
      sources: ['p-sinclair', 'p-doheny', 'history-fall', 'senate-td'],
    },
    r3_other: {
      room: 'r3', title: 'Filing Cabinet: Other Harding-Era Scandals', date: '1921–1924', creator: 'Museum research team (secondary source)',
      type: 'secondary', eq: ['A1', 'D2'],
      media: { kind: 'timeline', items: [
        ['Veterans Bureau', 'Director Charles Forbes diverted supplies from veterans’ hospitals and took payoffs from contractors. He served two years in prison.'],
        ['“Ohio Gang”', 'Harding’s political friends from Ohio — several were later charged with defrauding the government.'],
        ['Attorney General', 'Harry Daugherty survived impeachment attempts and two indictments involving seized German property; he was never convicted.'],
        ['Teapot Dome', 'Interior Secretary Fall: secret oil leases and bribes. A separate case from the ones above.'],
        ['Harding himself', 'Died Aug. 2, 1923. No evidence shows he personally took oil bribes; much of the corruption came to light after his death.'],
      ] },
      background: [
        'Teapot Dome was the most famous scandal of the Harding years, but it was not the only one. Keeping them separate helps us avoid blaming one person for everything — or excusing everyone.',
        'Harding reportedly felt betrayed by friends he had trusted. Whether he knew more than he admitted is a question historians still debate, and the evidence does not support claims that he profited from Teapot Dome.',
      ],
      why: 'Accurate history depends on precise claims. “Harding’s administration was corrupt” is supported. “Harding took oil bribes” is not. Learning to tell the difference is the core skill of this room.',
      question: 'Write one sentence about Harding and Teapot Dome that is fully supported by the evidence.',
      thinking: 'Example: “Corruption occurred within Harding’s administration, most famously by Interior Secretary Albert Fall, but there is no evidence Harding personally received oil bribes.”',
      sources: ['miller-harding', 'senate-td'],
    },

    /* ================= ROOM 4 ================= */
    r4_portrait: {
      room: 'r4', title: 'Calvin Coolidge: The Quiet President', date: 'Photograph c. Dec. 4, 1923; speeches 1925', creator: 'Library of Congress; Calvin Coolidge (speeches)',
      type: 'primary', eq: ['D1', 'D2'],
      media: { kind: 'image', src: IMG + 'coolidge.jpg', caption: 'Calvin Coolidge, c. December 4, 1923 (Library of Congress, LC-USZ62-13030).' },
      excerpt: { text: '“After all, the chief business of the American people is business. They are profoundly concerned with producing, buying, selling, investing and prospering in the world.”', by: 'Calvin Coolidge, Address to the American Society of Newspaper Editors, January 17, 1925', second: { text: '“I favor the policy of economy, not because I wish to save money, but because I wish to save people. The men and women of this country who toil are the ones who bear the cost of the Government.”', by: 'Calvin Coolidge, Inaugural Address, March 4, 1925' } },
      background: [
        'Coolidge was vice president when Harding died. On August 3, 1923, he took the oath of office at his family’s farmhouse in Vermont. He won a full term in 1924 and chose not to run in 1928.',
        'His nickname “Silent Cal” is misleading. According to the Miller Center, he held 520 press conferences — nearly eight a month — and spoke on the radio at least monthly. His 1925 inauguration was the first broadcast nationally by radio.',
      ],
      why: 'Coolidge’s quiet, thrifty image reassured Americans after the scandals. His words show his philosophy: a prosperous business economy and a frugal government were good for ordinary people. Note: his famous “business” line is often misquoted as “the business of America is business.”',
      question: 'Coolidge said economy (low spending) would “save people.” Who might agree? Who might disagree?',
      sources: ['p-coolidge', 'apus-asne', 'miller-inaug25', 'miller-coolidge', 'house-inaug25'],
    },
    r4_star: {
      room: 'r4', title: 'Front Page: Coolidge Responds to the Oil Scandal', date: 'February 13, 1924', creator: 'Evening Star (Washington, D.C.)',
      type: 'primary', eq: ['A1'],
      media: { kind: 'newspaper', src: IMG + 'news_star_1924_02_13.jpg', caption: 'Evening Star, Feb. 13, 1924, page 1 (Library of Congress). Headlines: “President Pledges Stern Action in Pursuit of Guilty” and “Special Oil Counsel Change Apparent as Confirmation Lags.” The cartoon labels the president “Silent Cal.”' },
      background: [
        'When the Teapot Dome revelations exploded in early 1924, Coolidge — now president and facing an election — promised to prosecute wrongdoing and appointed special counsel to handle the oil cases.',
        'The cartoon shows Uncle Sam reading “Coolidge’s Lincoln Day Speech,” with the caption “And they called him ‘Silent Cal.’” Even his nickname was part of the political conversation.',
      ],
      why: 'Coolidge distanced himself from the scandal and restored public confidence. That helped him win in 1924 — a reminder that how leaders respond to corruption shapes public trust as much as the corruption itself.',
      question: 'Zoom in on the left column. What did Coolidge promise? Why would that matter in an election year?',
      sources: ['star-1924b', 'miller-coolidge'],
    },
    r4_tax: {
      room: 'r4', title: 'Signing the “Mellon Tax Bill,” 1926', date: 'February 26, 1926', creator: 'Library of Congress, Prints & Photographs',
      type: 'primary', eq: ['C1', 'D2'],
      media: { kind: 'image', src: IMG + 'coolidge_taxbill.jpg', caption: 'Coolidge signing the income tax bill known as the Mellon tax bill, Feb. 26, 1926. Treasury Secretary Andrew Mellon is the third figure from the right (Library of Congress, LC-USZ62-110627).', extra: { src: IMG + 'mellon.jpg', caption: 'Andrew Mellon, Nov. 26, 1924 (Library of Congress).' } },
      background: [
        'Andrew Mellon served as Treasury Secretary from 1921 to 1932 under three presidents. He believed lower tax rates on high incomes would encourage investment.',
        'The Revenue Act of 1926 cut the top income-tax rate to 25 percent and also reduced estate (inheritance) and gift taxes. Coolidge also ran budget surpluses: the federal debt fell from about $25.5 billion in 1919 to about $16.9 billion in 1929.',
      ],
      why: 'Supporters saw a frugal government paying its bills while the economy boomed. Critics — then and now — argued the biggest benefits went to the wealthy, and some historians argue these policies fed speculation. That debate continues in tax policy today.',
      question: 'Is paying down the national debt during good times wise policy? What are the trade-offs?',
      sources: ['p-taxbill', 'p-mellon', 'treasury-mellon', 'cato-tax', 'fiscal-debt', 'miller-coolidge'],
    },
    r4_farm: {
      room: 'r4', title: 'The Federal Budget and the American Farmer', date: '1924–1928', creator: 'Library of Congress photograph + interactive display created for this museum',
      type: 'primary', eq: ['C1', 'A2'],
      media: { kind: 'priorities', img: IMG + 'coolidge_farmers.jpg', imgCaption: 'Coolidge on the White House lawn with members of the House Agricultural Committee and western farmers, Jan. 12, 1924 (Library of Congress).' },
      background: [
        'Farmers had expanded production during World War I to feed Europe. When the war ended, demand and prices fell — and farm hardship continued through the 1920s, even as cities boomed.',
        'Congress twice passed the McNary-Haugen bill, which would have had a government corporation buy surplus crops at set prices. Coolidge vetoed both versions (1927 and 1928), arguing it was costly and would encourage overproduction.',
      ],
      why: 'Every budget is a statement of priorities. Tax cuts, debt reduction, and farm relief all competed for the same limited dollars — and the choices made helped some groups far more than others.',
      question: 'Use the comparison display. Which priority did the Coolidge administration choose most often? Who paid the cost of that choice?',
      sources: ['p-farmers', 'miller-coolidge', 'fiscal-debt'],
    },
    r4_ticker: {
      room: 'r4', title: 'The Stock Ticker: Boom and Overconfidence', date: '1924–1929', creator: 'Museum research team (secondary source)',
      type: 'secondary', eq: ['D1', 'D2'],
      media: { kind: 'timeline', items: [
        ['Mass production', 'Cars, radios, and appliances poured out of factories; national brands and advertising spread.'],
        ['Buying on credit', 'Installment plans let families buy now and pay later — expanding sales and household debt.'],
        ['Buying on margin', 'Investors borrowed money to buy stocks, betting prices would keep rising.'],
        ['Uneven gains', 'Farmers and workers in older industries like coal and textiles shared little of the boom.'],
        ['March 1929', 'Coolidge leaves office; Herbert Hoover becomes president.'],
        ['October 1929', 'The stock market crashes — seven months after Coolidge’s presidency ended.'],
      ] },
      background: [
        'The 1920s economy grew rapidly, and many observers at the time credited “Coolidge Prosperity.” Rising stock prices made speculation seem safe.',
        'The Miller Center argues that Coolidge’s fiscal policy encouraged speculation and his light regulation let margin trading flourish, probably contributing to the crash. Other economists emphasize the Federal Reserve’s decisions, global debt problems (Room 5), and banking failures. The Great Depression had many causes.',
      ],
      why: 'This is cause and effect at its most debated. Coolidge’s policies did not single-handedly cause the Depression — but the vulnerabilities of the 1920s help explain why the crash hit so hard.',
      question: 'Why do historians disagree about the causes of the Great Depression? Name two factors from this museum.',
      sources: ['miller-coolidge', 'ushistory-46', 'ohs-dawes'],
    },

    /* ================= ROOM 5 ================= */
    r5_flow: {
      room: 'r5', title: 'The Great Map: Following the Money', date: '1924–1928', creator: 'Diagram created for this museum (secondary source)',
      type: 'secondary', eq: ['D1', 'C1'],
      media: { kind: 'diagram' },
      background: [
        'During the war, the U.S. lent the Allies more than $10 billion. In 1921, the Reparation Commission set Germany’s bill at 132 billion gold marks — about $31.5 billion.',
        'The United States insisted on being repaid and refused to link war debts to reparations. In the Office of the Historian’s words: “Time and again, Washington rejected calls to cancel these debts.”',
        'After the Dawes Plan, U.S. banks lent to Germany for about four years. Germany paid reparations to France and Britain, which used the money to pay their war debts to the United States.',
      ],
      why: 'The cycle only worked while American credit kept flowing. After U.S. bank loans dried up in 1928, Germany’s economy floundered — showing how deeply America was tied to Europe even while avoiding the League of Nations.',
      question: 'Trace the circle with your finger. Where does the money start, and where does it end up?',
      sources: ['ohs-dawes'],
    },
    r5_dawes: {
      room: 'r5', title: 'The Dawes Plan, 1924', date: 'Proposed April 1924', creator: 'Committee chaired by Charles G. Dawes',
      type: 'primary', eq: ['D1'],
      media: { kind: 'image', src: IMG + 'dawes.jpg', caption: 'Charles G. Dawes, c. 1924 (Library of Congress, LC-USZ6-849).' },
      background: [
        'In January 1923, Germany defaulted on a reparation payment. France and Belgium occupied the Ruhr, Germany’s industrial heartland. German workers resisted, inflation became hyperinflation, and the German currency collapsed.',
        'A committee led by Chicago banker Charles G. Dawes proposed a plan in April 1924. Germany’s yearly payments were reduced and would rise as its economy improved; Germany adopted a new currency, the Reichsmark; France and Belgium would leave the Ruhr; and foreign banks would lend Germany $200 million. J.P. Morgan floated the loan in the U.S., where it was quickly oversubscribed.',
        'Dawes shared the 1925 Nobel Peace Prize — and became Coolidge’s vice president that same year.',
      ],
      why: 'The plan calmed a dangerous crisis without the U.S. joining any alliance. But it relied on private American lending. When that lending stopped, the problem returned. The 1929 Young Plan cut reparations again before the Depression undermined it.',
      question: 'Why might private bank loans be a less reliable foundation for peace than a government treaty?',
      sources: ['ohs-dawes', 'p-dawes'],
    },
    r5_kellogg: {
      room: 'r5', title: 'The Kellogg-Briand Pact, 1928', date: 'Signed August 27, 1928, in Paris', creator: 'U.S. Secretary of State Frank B. Kellogg and French Foreign Minister Aristide Briand',
      type: 'primary', eq: ['D1', 'A1'],
      media: { kind: 'document', heading: 'General Treaty for Renunciation of War as an Instrument of National Policy', lines: [
        ['Article I', '“The High Contracting Parties solemnly declare in the names of their respective peoples that they condemn recourse to war for the solution of international controversies, and renounce it, as an instrument of national policy in their relations with one another.”'],
        ['Article II', '“The High Contracting Parties agree that the settlement or solution of all disputes or conflicts of whatever nature or of whatever origin they may be, which may arise among them, shall never be sought except by pacific means.”'],
      ], foot: 'Text verified from the Avalon Project, Yale Law School.' },
      background: [
        'Briand first proposed a U.S.–French pact in 1927. Coolidge and Kellogg preferred an agreement open to all nations, so a two-country pact would not look like an alliance obligating the U.S. to defend France.',
        'Fifteen nations signed on the first day, including the United States, the United Kingdom, France, Germany, Italy, and Japan; 47 more joined later. The Senate approved it 85 to 1 — with reservations stating it did not limit U.S. self-defense or require action against violators.',
      ],
      why: 'The pact had no enforcement mechanism and never defined “self-defense.” When Japan invaded Manchuria in 1931, no one acted to enforce it. Agreeing to a principle is not the same as creating a way to enforce it — but the pact remains a symbol of the era’s hopes for peace.',
      question: 'Is a promise without enforcement worthless? Make one argument for and one against.',
      sources: ['avalon-kb', 'ohs-kellogg'],
    },
    r5_naval: {
      room: 'r5', title: 'The Washington Naval Conference, 1921–1922', date: 'November 1921 – February 1922', creator: 'Harris & Ewing photograph; Library of Congress',
      type: 'primary', eq: ['C1', 'D1'],
      media: { kind: 'image', src: IMG + 'naval_conf.jpg', caption: 'The Conference on Limitation of Armaments in session, Washington, D.C., 1921 or 1922 (Harris & Ewing, Library of Congress).' },
      background: [
        'Under Harding, Secretary of State Charles Evans Hughes invited nine nations to Washington to stop a costly naval arms race. The Five-Power Treaty set a 5:5:3 ratio for battleship tonnage — 500,000 tons each for the U.S. and Britain, 300,000 for Japan, and 175,000 each for France and Italy — and the powers agreed to stop building and scrap older ships.',
        'The Four-Power Treaty replaced the Anglo-Japanese alliance, and the Nine-Power Treaty promised to respect China’s territorial integrity.',
      ],
      why: 'This was American leadership in world affairs — just not through the League of Nations. Limiting warships also saved money, matching the era’s focus on economy. But unrestricted ship types sparked a cruiser race, and the China treaty had no enforcement.',
      question: 'How does the Naval Conference challenge the idea that America was “isolationist” in the 1920s?',
      sources: ['ohs-naval', 'p-naval'],
    },
    r5_league: {
      room: 'r5', title: 'The Empty Chair: America and the League', date: '1919–1920', creator: 'Museum installation (secondary source)',
      type: 'secondary', eq: ['D1', 'D2'],
      media: { kind: 'timeline', items: [
        ['Jan. 1919', 'Wilson helps write the League of Nations into the Treaty of Versailles.'],
        ['1919', 'Senator Henry Cabot Lodge’s committee adds reservations to protect U.S. independence of action.'],
        ['Nov. 19, 1919', 'The Senate rejects the treaty — the first time it ever rejected a peace treaty.'],
        ['1920', 'The treaty fails again; Harding campaigns against “submergence in internationality.”'],
        ['1920s', 'The League meets in Geneva without the United States.'],
      ] },
      background: [
        'Many Americans feared that Article X of the League Covenant could drag the United States into foreign wars without a vote of Congress. Wilson refused to compromise with the Senate, and the treaty failed.',
        'Harding’s “normalcy” promised to keep America out of such commitments — but, as this room shows, not out of world affairs altogether.',
      ],
      why: 'Historians debate whether U.S. absence weakened the League fatally. Either way, the empty chair symbolizes a choice: influence through money and treaties, but no permanent security commitments.',
      question: 'Was staying out of the League a reasonable response to World War I, or a mistake? Use evidence from this room.',
      sources: ['senate-versailles', 'ohs-league', 'loc-readjust'],
    },

    /* ================= ROOM 6 ================= */
    r6_immig: {
      room: 'r6', title: 'The Immigration Act of 1924', date: 'Signed May 26, 1924 (earlier law: May 19, 1921)', creator: 'U.S. Congress (Johnson-Reed Act); signed by President Coolidge',
      type: 'primary', eq: ['A2', 'D1'],
      media: { kind: 'document', img: IMG + 'ellis.jpg', imgCaption: 'Immigrants at Ellis Island, between 1907 and 1917 — before the quota laws (Library of Congress).', heading: 'Comparing the quota laws', lines: [
        ['1921 law', '“…limited to 3 per centum of the number of foreign-born persons of such nationality resident in the United States as determined by the United States census of 1910.”'],
        ['1924, Sec. 11(a)', '“The annual quota of any nationality shall be 2 per centum of the number of foreign-born individuals of such nationality resident in continental United States as determined by the United States census of 1890…”'],
        ['1924, Sec. 13(c)', '“No alien ineligible to citizenship shall be admitted to the United States…” (with narrow exceptions)'],
      ], foot: 'Wording verified from 42 Stat. 5 and 43 Stat. 153 (GovInfo).' },
      background: [
        'Why switch from the 1910 census to the 1890 census? In 1890, far fewer immigrants from southern and eastern Europe (such as Italy, Poland, and Russia) lived in the United States. Using the older census shrank their quotas and favored immigrants from Britain, Ireland, Germany, and Scandinavia.',
        'Section 13(c) barred people “ineligible to citizenship.” Because earlier naturalization laws excluded people of Asian descent from citizenship, this effectively ended immigration from Japan. Japan protested, and tensions between the two countries rose. The quotas did not apply to the Western Hemisphere.',
      ],
      why: 'The Office of the Historian concludes: “In all of its parts, the most basic purpose of the 1924 Immigration Act was to preserve the ideal of U.S. homogeneity.” Supporters spoke of protecting American jobs and culture; the law’s formula shows whom they meant by “American.”',
      question: 'Compare the law’s stated rule (a percentage of a census) with its effect. Why might lawmakers choose a neutral-sounding formula to achieve an unequal result?',
      sources: ['stat-quota21', 'stat-immig24', 'ohs-immig', 'p-ellis'],
    },
    r6_gitlow: {
      room: 'r6', title: 'Gitlow v. New York, 1925', date: 'Decided June 8, 1925', creator: 'U.S. Supreme Court (majority: Justice Edward Sanford; dissent: Justices Holmes and Brandeis)',
      type: 'primary', eq: ['A2', 'A1'],
      media: { kind: 'case', timeline: [
        ['1919', 'Benjamin Gitlow, a socialist leader, helps publish the “Left Wing Manifesto” in a paper called The Revolutionary Age. Sixteen thousand copies are printed.'],
        ['1919–1920', 'He is convicted under New York’s criminal anarchy law for advocating the overthrow of government.'],
        ['June 8, 1925', 'The Supreme Court upholds his conviction, 7–2 — but rules that free speech is protected against the states.'],
        ['Dec. 1925', 'New York governor Al Smith pardons Gitlow.'],
      ], note: 'No rights-cleared photograph of Gitlow is available, so this display uses a pixel-art illustration. View his Library of Congress record at loc.gov/item/2002711324/.' },
      excerpt: { text: '“For present purposes we may and do assume that freedom of speech and of the press—which are protected by the First Amendment from abridgment by Congress—are among the fundamental personal rights and ‘liberties’ protected by the due process clause of the Fourteenth Amendment from impairment by the States.”', by: 'Justice Edward T. Sanford, majority opinion', second: { text: '“Every idea is an incitement. It offers itself for belief and if believed it is acted on unless some other belief outweighs it or some failure of energy stifles the movement at its birth.”', by: 'Justice Oliver Wendell Holmes Jr., dissenting' } },
      background: [
        'The First Amendment says “Congress shall make no law… abridging the freedom of speech.” Originally, that limited only the federal government. The Fourteenth Amendment (1868) says no state may deprive any person of liberty “without due process of law.”',
        'In Gitlow, the Court connected the two: free speech is one of the “liberties” the Fourteenth Amendment protects from state governments. This idea is called incorporation. The Court still upheld Gitlow’s conviction, saying the state could punish speech that threatened public order.',
        'The American Civil Liberties Union, founded in 1920, calls Gitlow its first Supreme Court landmark.',
      ],
      why: 'Gitlow lost his case, but the Constitution’s protection grew. The case captures the 1920s tension between public order and individual freedom — a tension born in the Red Scare (Room 1).',
      question: 'Distinguish the outcome for Gitlow from the case’s constitutional significance. Why can both be true at once?',
      sources: ['lii-gitlow', 'aclu'],
    },
    r6_aclu: {
      room: 'r6', title: 'Civil Liberties After the Red Scare', date: '1920–1925', creator: 'Museum research team (secondary source)',
      type: 'secondary', eq: ['A2', 'D2'],
      media: { kind: 'timeline', items: [
        ['1919–1920', 'Palmer Raids: thousands arrested, many held without proper legal process.'],
        ['1920', 'The American Civil Liberties Union is founded to defend free speech and due process.'],
        ['Dec. 1921', 'Harding commutes the sentence of Eugene V. Debs, imprisoned for opposing the war.'],
        ['1925', 'Gitlow v. New York: free speech applies to the states.'],
      ] },
      background: [
        'The Red Scare forced Americans to ask how much freedom a society should allow when it feels threatened. Supporters of the raids pointed to real bombings; critics pointed to mass arrests of people who had committed no crime.',
        'Organizations like the ACLU argued that defending unpopular speech protects everyone’s rights. Note: the ACLU source in our bibliography describes the organization’s own history — a perspective to keep in mind.',
      ],
      why: 'Normalcy promised order. Civil liberties advocates asked: order at what cost, and for whom? The debate between security and freedom continues in modern public policy.',
      question: 'When, if ever, should government limit speech to protect public safety? Use Gitlow or the Palmer Raids as evidence.',
      sources: ['aclu', 'fbi-palmer', 'miller-harding', 'lii-gitlow'],
    },
    r6_unequal: {
      room: 'r6', title: 'Unequal Experiences of Normalcy', date: '1916–1929', creator: 'Museum research team (secondary source)',
      type: 'secondary', eq: ['A2', 'D2'],
      media: { kind: 'timeline', items: [
        ['1910–1940', 'The First Great Migration: about 2 million Black Southerners move north and west between the World Wars, seeking jobs and escape from Jim Crow and racial violence.'],
        ['May 31–June 1, 1921', 'Tulsa Race Massacre: a white mob destroys Greenwood, Tulsa’s Black district. More than 1,000 homes and businesses are destroyed; credible death estimates range from 50 to 300.'],
        ['Oct. 1921', 'In Birmingham, Alabama, Harding publicly criticizes the unfair treatment of Black Americans.'],
        ['Jan. 1922', 'The House passes the Dyer Anti-Lynching Bill. Southern senators block it; it never becomes law.'],
        ['1920s', 'In Northern cities, migrants find new jobs and build cultural movements like the Harlem Renaissance — but face housing discrimination and segregated neighborhoods.'],
      ] },
      background: [
        'For many Black Americans, the 1920s combined real opportunity with real danger. Northern factory jobs paid more than Southern farm work, and vibrant communities grew in cities like New York, Chicago, and Detroit.',
        'At the same time, racial violence, segregation, and discrimination limited who could share in the decade’s prosperity and political promises.',
      ],
      why: 'The era was neither universally prosperous nor universally bleak. Comparing experiences across groups shows that “normal” meant very different things depending on race, region, and class.',
      question: 'The House passed an anti-lynching bill, but the Senate blocked it. What does this tell you about whose safety national politics protected in the 1920s?',
      sources: ['nara-migration', 'ohs-tulsa', 'naacp-dyer', 'miller-harding', 'ushistory-46'],
    },

    /* ================= TOWN ================= */
    town_memorial: {
      room: 'town', title: 'The Doughboy Memorial', date: 'Modern pixel-art illustration', creator: 'Created for this museum',
      type: 'illustration', eq: ['D1'],
      media: { kind: 'none' },
      background: [
        'After World War I, towns across America raised memorials to local soldiers, often a bronze “doughboy” — the nickname for American infantrymen. This statue is an illustration inspired by those memorials, not a copy of a specific one.',
        'More than four million Americans served in the armed forces during the war. Their return home in 1919 is where our story begins — at Union Station, just northwest of here.',
      ],
      why: 'The war’s upheaval is the reason “normalcy” sounded so appealing. Start your investigation at Exhibit 1.',
      question: 'Why might communities want to build memorials soon after a war? What do memorials remember — and what might they leave out?',
      sources: [],
    },
  };

  /* -------------------------------------------------------------------
     8. MINI-GAME DATA
     ------------------------------------------------------------------- */
  const GAMES = {};

  // ---- Room 1: Restore Stability (historical simulation) ----
  GAMES.r1 = {
    title: 'Restore Stability', subtitle: 'A historical simulation — you are a fictional adviser in 1920–1922',
    intro: 'You will face four challenges left by World War I. Each option has benefits and drawbacks. After each choice, you will see what the federal government actually did. The two meters are a simplified simulation, not historical measurements.',
    meters: ['Public Confidence', 'Fairness to Workers & Minorities'],
    rounds: [
      { title: 'Economic Uncertainty', when: '1920–1921', prompt: 'The postwar depression has hit: wages are falling and more than 20,000 businesses have failed. What should the federal government prioritize?',
        options: [
          { t: 'Cut government spending and taxes to restore business confidence.', pro: 'Signals stability to investors; reduces the wartime tax burden.', con: 'Offers little direct help to the unemployed.', m: [2, -1] },
          { t: 'Launch federal public-works jobs for the unemployed.', pro: 'Puts people to work quickly.', con: 'Costly; very few leaders in 1921 supported a large federal jobs role.', m: [0, 2] },
          { t: 'Do nothing and let the market correct itself.', pro: 'No new spending.', con: 'Hardship lasts longer with no plan.', m: [-1, -1] },
        ],
        actual: 'Harding relied mainly on economy: the Budget and Accounting Act tightened spending, and the Revenue Act of 1921 began cutting taxes. The depression ended by 1922, and a long boom followed — though historians debate how much policy caused the recovery.', src: 'miller-harding' },
      { title: 'Labor Unrest', when: '1922', prompt: 'About 400,000 railroad shop workers strike after the federal Railroad Labor Board approves unfavorable rulings. Trains are disrupted nationwide.',
        options: [
          { t: 'Seek a court injunction to end the strike.', pro: 'Restores rail service quickly.', con: 'Uses federal power against workers and their unions.', m: [1, -2] },
          { t: 'Push both sides into federal mediation.', pro: 'Could produce a fairer settlement.', con: 'Slower; railroads may refuse.', m: [1, 1] },
          { t: 'Stay neutral and let the strike play out.', pro: 'Avoids taking sides.', con: 'Long disruption to the economy.', m: [-1, 0] },
        ],
        actual: 'Attorney General Harry Daugherty obtained “a sweeping injunction against the strikers and their leadership.” The strike was settled in October 1922, largely in favor of the railroads. Workers saw it as proof that normalcy favored employers.', src: 'dah-rail' },
      { title: 'Fear of Radicalism', when: '1919–1921', prompt: 'After the 1919 bombings and the Palmer Raids, socialist leader Eugene V. Debs is still in federal prison for speaking against the war. Some want him freed; others say he is dangerous.',
        options: [
          { t: 'Keep Debs in prison to show strength against radicals.', pro: 'Reassures people who fear revolution.', con: 'Punishes political speech; deepens divisions.', m: [0, -2] },
          { t: 'Commute his sentence as a gesture of healing.', pro: 'Signals the wartime crackdown is over.', con: 'Angers some veterans and patriotic groups.', m: [1, 2] },
          { t: 'Expand raids against suspected radicals.', pro: 'Looks tough on disorder.', con: 'Violates civil liberties of innocent people.', m: [-1, -3] },
        ],
        actual: 'In December 1921, Harding commuted Debs’s sentence — and even invited him to the White House. It was one sign that Harding meant “healing,” not continued crackdowns. Still, fear of radicals shaped immigration and speech laws for years (see Room 6).', src: 'miller-harding' },
      { title: 'America’s Role in the World', when: '1921', prompt: 'The Senate has rejected the Treaty of Versailles and the League of Nations. But Japan, Britain, and the U.S. are racing to build expensive battleships.',
        options: [
          { t: 'Try again to join the League of Nations.', pro: 'Builds collective security.', con: 'The Senate already rejected it; politically impossible.', m: [-2, 0] },
          { t: 'Host a conference to limit navies by treaty.', pro: 'Saves money and reduces tension without joining the League.', con: 'Treaties may lack enforcement.', m: [2, 0] },
          { t: 'Win the arms race by outbuilding everyone.', pro: 'Strongest navy in the world.', con: 'Enormously expensive; raises tensions.', m: [-1, -1] },
        ],
        actual: 'Secretary of State Charles Evans Hughes hosted the Washington Naval Conference (1921–22), which set a 5:5:3 battleship ratio. The U.S. stayed out of the League but led on disarmament — see Room 5.', src: 'ohs-naval' },
    ],
  };

  // ---- Room 2: The President's Policy Desk ----
  GAMES.r2 = {
    title: 'The President’s Policy Desk', subtitle: 'Match each policy to its purpose, the institution responsible, and who it affected most',
    policies: [
      { id: 'budget', name: 'Budget and Accounting Act (1921)', purpose: 'Create one national budget and independent audits of spending', inst: 'Congress passed it; the new Bureau of the Budget and GAO carried it out', groups: 'Taxpayers and federal agencies', exp: 'Before 1921 there was no single national budget. The act required a presidential budget each year, created the Bureau of the Budget (in the Treasury), and created the independent General Accounting Office.', src: 'stat-budget' },
      { id: 'revenue', name: 'Revenue Act of 1921', purpose: 'Cut wartime taxes, especially top rates, to encourage investment', inst: 'Congress, pushed by Treasury Secretary Mellon', groups: 'Wealthy taxpayers and corporations most directly', exp: 'It lowered the top income-tax rate (73% → 58% beginning in 1922) and repealed the excess-profits tax. Mellon argued lower rates would spur investment; critics said the rich gained most.', src: 'stat-revenue' },
      { id: 'tariff', name: 'Fordney-McCumber Tariff (1922)', purpose: 'Raise taxes on imports to protect American industry', inst: 'Congress; the president could adjust rates on the Tariff Commission’s advice', groups: 'Manufacturers (helped); consumers and foreign exporters (hurt)', exp: 'Higher tariffs reversed Wilson-era cuts. The “flexible” Section 315 let the president raise or lower rates by up to 50%.', src: 'stat-tariff' },
      { id: 'injunction', name: 'Daugherty Injunction (1922)', purpose: 'End the national railroad shop workers’ strike', inst: 'Attorney General (Justice Department) through a federal court', groups: 'Railroad workers and their unions', exp: 'Attorney General Daugherty secured a sweeping injunction against strikers and their leaders. The settlement largely favored the railroads.', src: 'dah-rail' },
    ],
    quiz: [
      { q: 'Which group most directly benefited from the Fordney-McCumber Tariff?', opts: ['Consumers buying imported goods', 'American manufacturers facing foreign competition', 'European exporters'], a: 1, exp: 'Tariffs raise the price of imports, protecting domestic producers. Consumers and foreign exporters generally lost.', src: 'stat-tariff' },
      { q: 'Before 1921, how did the federal government handle its budget?', opts: ['The president sent one unified budget each year', 'Each agency sent its own requests to Congress', 'The Supreme Court approved all spending'], a: 1, exp: 'There was no central budget. The Budget and Accounting Act changed that, giving the president responsibility for a single annual budget.', src: 'miller-harding' },
      { q: 'Which statement best describes the debate over Mellon’s tax cuts?', opts: ['Everyone agreed they only helped the poor', 'Supporters said they spurred investment; critics said they mainly helped the wealthy', 'They raised taxes on businesses'], a: 1, exp: 'The Cato Institute credits the cuts with growth; the Miller Center emphasizes how much the wealthiest gained. Examining both perspectives is essential.', src: 'cato-tax' },
    ],
  };

  // ---- Room 3: Solve the Teapot Dome Case ----
  GAMES.r3 = {
    title: 'Solve the Teapot Dome Case', subtitle: 'An evidence investigation in six steps',
    evidence: ['r3_board'],
    timeline: [
      { id: 't1', t: 'Naval oil reserves set aside as emergency fuel for the Navy', d: '1912–1915' },
      { id: 't2', t: 'Harding’s executive order moves the reserves to the Interior Department', d: '1921' },
      { id: 't3', t: 'Fall secretly leases Teapot Dome and Elk Hills without competitive bidding', d: '1922' },
      { id: 't4', t: 'Wall Street Journal report; Senator Kendrick calls for an investigation', d: 'April 1922' },
      { id: 't5', t: 'Harding dies in San Francisco', d: 'August 1923' },
      { id: 't6', t: 'Senate hearings reveal money from the oilmen to Fall', d: '1923–1924' },
      { id: 't7', t: 'Supreme Court cancels the leases; McGrain v. Daugherty upholds Senate subpoena power', d: '1927' },
      { id: 't8', t: 'Fall convicted of accepting a bribe', d: 'October 1929' },
    ],
    suspect: { q: 'Which public official arranged the secret leases?', opts: ['President Warren G. Harding', 'Interior Secretary Albert B. Fall', 'Senator Thomas Walsh', 'Vice President Calvin Coolidge'], a: 1,
      exp: 'Albert B. Fall, as Interior Secretary, signed the leases. Harding transferred control of the reserves to Interior, but there is no evidence he took bribes. Walsh led the investigation that exposed Fall. Coolidge had no role in the leases.' },
    connect: { q: 'Connect each reserve to the private interest that received its lease.', pairs: [['Teapot Dome, Wyoming', 'Harry Sinclair — Mammoth Oil'], ['Elk Hills, California', 'Edward Doheny — Pan American Petroleum']] },
    claims: [
      { t: 'Albert Fall received $100,000 from Edward Doheny.', proven: true, exp: 'Established: Doheny admitted the money; both called it a “loan.”' },
      { t: 'The Teapot Dome lease was made without competitive bidding.', proven: true, exp: 'Established by the Senate’s own history of the investigation.' },
      { t: 'President Harding personally accepted oil bribes.', proven: false, exp: 'Not supported. Harding died in 1923; no evidence shows he took bribes.' },
      { t: 'Fall was convicted of accepting a bribe.', proven: true, exp: 'Established: convicted October 25, 1929.' },
      { t: 'Every member of Harding’s cabinet was corrupt.', proven: false, exp: 'Not supported. Officials like Hughes, Mellon, and Hoover were never implicated in the scandals.' },
      { t: 'Edward Doheny was convicted of bribing Fall.', proven: false, exp: 'False: Doheny was acquitted in 1930 — even though Fall was convicted of taking his money.' },
    ],
    senate: { q: 'What was the Senate investigation’s most important role?', opts: ['It wrote the oil leases', 'It exposed the secret deals and the money trail to the public', 'It sentenced Fall to prison'], a: 1,
      exp: 'Congress investigates; courts convict. Walsh’s committee uncovered the evidence, and the 1927 McGrain v. Daugherty decision confirmed Congress’s power to compel testimony.' },
    summary: 'CASE SUMMARY — Public oil reserved for the Navy was leased in secret by Interior Secretary Albert B. Fall to two oilmen who gave him money. A newspaper report and a determined Senate investigation exposed the deals; the Supreme Court cancelled the leases; and Fall became the first former cabinet officer to go to prison. The scandal shook public trust — but it also showed accountability working through a free press, Congress, and the courts.',
  };

  // ---- Room 4: Balancing the Budget ----
  GAMES.r4 = {
    title: 'Balancing the Budget', subtitle: 'You are a fictional policy adviser to the Coolidge administration, 1925',
    budget: 10,
    rules: 'You have 10 budget points to divide among six priorities. Each point is a simplified unit — NOT a real dollar amount from Coolidge’s budget. The simulated indicators below change according to fixed, visible rules.',
    cats: [
      { id: 'tax', name: 'Tax cuts', desc: 'Lower income and estate taxes (the Mellon program).', fx: { business: 2, farm: 0, debt: -1, services: 0 }, helps: 'Investors, high earners, businesses', hurts: 'Less revenue for other priorities' },
      { id: 'debt', name: 'Pay down national debt', desc: 'Retire wartime debt using surpluses.', fx: { business: 1, farm: 0, debt: 2, services: 0 }, helps: 'Future taxpayers, bond markets', hurts: 'No immediate help to anyone struggling' },
      { id: 'farm', name: 'Farm relief', desc: 'McNary-Haugen-style crop price supports.', fx: { business: 0, farm: 3, debt: -1, services: 0 }, helps: 'Farm families facing low prices', hurts: 'Taxpayers; critics feared overproduction' },
      { id: 'roads', name: 'Roads & infrastructure', desc: 'Federal aid for highways and waterways.', fx: { business: 1, farm: 1, debt: -1, services: 1 }, helps: 'Drivers, rural areas, construction workers', hurts: 'Higher spending' },
      { id: 'vets', name: 'Veterans’ bonus', desc: 'Extra compensation for World War I veterans.', fx: { business: 0, farm: 0, debt: -1, services: 2 }, helps: 'Veterans and their families', hurts: 'Higher spending and debt' },
      { id: 'navy', name: 'Naval & military', desc: 'Ships and defense within treaty limits.', fx: { business: 1, farm: 0, debt: -1, services: 0 }, helps: 'Shipbuilders, defense', hurts: 'Higher spending' },
    ],
    indicators: { business: 'Business confidence', farm: 'Farm well-being', debt: 'Debt reduction', services: 'Direct public help' },
    actual: 'The actual Coolidge administration put tax cuts and debt reduction first. With Mellon, it passed the Revenue Acts of 1924 and 1926, ran surpluses, and cut the debt from about $25.5 billion (1919) to about $16.9 billion (1929). Coolidge vetoed the McNary-Haugen farm bills in 1927 and 1928, and vetoed a 1924 veterans’ bonus bill — Congress overrode that veto.',
    srcs: ['miller-coolidge', 'fiscal-debt', 'cato-tax'],
  };

  // ---- Room 5: Repair the International Economy ----
  GAMES.r5 = {
    title: 'Repair the International Economy', subtitle: 'Rebuild the money cycle of the Dawes Plan years (simplified model)',
    nodes: [
      { id: 'banks', name: 'U.S. Banks', x: 0.16, y: 0.3 },
      { id: 'germany', name: 'Germany', x: 0.8, y: 0.3 },
      { id: 'allies', name: 'Britain & France', x: 0.8, y: 0.78 },
      { id: 'treasury', name: 'U.S. Government', x: 0.16, y: 0.78 },
    ],
    flows: [
      { from: 'banks', to: 'germany', label: 'Private loans', exp: 'After the Dawes Plan (1924), American banks lent heavily to Germany, starting with a $200 million loan floated by J.P. Morgan.' },
      { from: 'germany', to: 'allies', label: 'Reparation payments', exp: 'Germany used much of that borrowed money to pay reparations to France, Britain, and other Allies.' },
      { from: 'allies', to: 'treasury', label: 'War-debt repayments', exp: 'The Allies used reparation receipts to repay the more than $10 billion the U.S. had lent them during the war.' },
    ],
    labels: ['Private loans', 'Reparation payments', 'War-debt repayments'],
    scenario: { title: 'Scenario: 1928 — American lending dries up', prompt: 'The stock market is booming, and U.S. banks stop lending to Germany. Which parts of the cycle are affected? Select all that apply.',
      opts: [
        { t: 'Germany has trouble paying reparations', a: true },
        { t: 'Britain and France receive less money', a: true },
        { t: 'War-debt repayments to the U.S. are threatened', a: true },
        { t: 'Nothing changes — each payment is independent', a: false },
      ],
      exp: 'Every link depended on the first one. According to the Office of the Historian, after U.S. bank loans dried up in 1928, Germany’s economy floundered. Hoover proposed a one-year moratorium on debts and reparations in 1931, and by mid-1933 every European debtor except Finland had defaulted on its U.S. loans.',
      caveat: 'SIMPLIFIED MODEL: Real international finance involved trade, tariffs, gold, central banks, and much more. This puzzle is not a complete explanation of the Great Depression.' },
    kellogg: { q: 'Bonus: The Kellogg-Briand Pact renounced war. What did it lack?', opts: ['Signatures from major powers', 'Any enforcement mechanism or sanctions', 'Support from the U.S. Senate'], a: 1, exp: 'Fifteen nations signed at first and the Senate approved it 85–1 — but there were no sanctions and no definition of self-defense. Japan’s 1931 invasion of Manchuria went unpunished.' },
    src: 'ohs-dawes',
  };

  // ---- Room 6: Who Experienced Normalcy? ----
  GAMES.r6 = {
    title: 'Who Experienced Normalcy?', subtitle: 'Historical perspectives — every profile is a labeled composite based on real laws and events',
    intro: 'These are not real individuals. Each is a historical composite built from documented conditions of the 1920s. For each person, choose the policy or event that most directly shaped their life. There is no score — the goal is understanding.',
    profiles: [
      { name: 'Walter, 52', role: 'Factory owner, Ohio', look: 'businessman', story: 'Walter runs a mid-sized machine shop. Foreign competitors undercut his prices before the war, and high wartime taxes ate into profits he wanted to reinvest.',
        opts: ['Fordney-McCumber Tariff and Mellon tax cuts', 'Immigration Act of 1924', 'Gitlow v. New York'], a: 0,
        exp: 'Higher tariffs protected Walter’s products from foreign competition, and tax cuts let him keep more profit. For business owners like him, normalcy often meant stability and growth.', src: 'stat-tariff' },
      { name: 'Rosa, 34', role: 'Railroad shop worker’s wife, Illinois', look: 'worker', story: 'Rosa’s husband repairs locomotives. In 1922 his union walked out over wage cuts and working rules. The family lived on savings for months.',
        opts: ['Kellogg-Briand Pact', 'The 1922 railroad strike and the Daugherty injunction', 'Revenue Act of 1926'], a: 1,
        exp: 'The federal injunction broke the strike, and the settlement largely favored the railroads. For many working families, government power seemed to side with employers.', src: 'dah-rail' },
      { name: 'Emil, 45', role: 'Wheat farmer, North Dakota', look: 'farmer', story: 'Emil borrowed money during the war to buy more land when wheat prices were high. Now prices have fallen, and he struggles to pay his mortgage.',
        opts: ['Coolidge’s vetoes of the McNary-Haugen farm bills', 'The Washington Naval Conference', 'The Budget and Accounting Act'], a: 0,
        exp: 'Congress passed McNary-Haugen twice to support crop prices, and Coolidge vetoed it twice (1927, 1928). Farm hardship continued through the decade even as cities boomed.', src: 'miller-coolidge' },
      { name: 'Giuseppe, 23', role: 'Hopes to immigrate from Italy', look: 'immigrant', story: 'Giuseppe’s older brother emigrated to New York in 1913. Giuseppe planned to join him, but after 1924 the line for Italian visas is impossibly long.',
        opts: ['The Dawes Plan', 'Immigration Act of 1924', 'Fordney-McCumber Tariff'], a: 1,
        exp: 'The 1924 law based quotas on the 1890 census, sharply cutting visas for southern and eastern Europeans like Italians. Its purpose, according to the Office of the Historian, was “to preserve the ideal of U.S. homogeneity.”', src: 'ohs-immig' },
      { name: 'Helen, 29', role: 'Civil-liberties volunteer, New York', look: 'flapper', story: 'Helen helps raise money for defendants arrested for their political writing. She believes protecting unpopular speech protects everyone.',
        opts: ['Gitlow v. New York and the founding of the ACLU', 'Revenue Act of 1921', 'McNary-Haugen vetoes'], a: 0,
        exp: 'The ACLU (founded 1920) defended free speech after the Red Scare. In Gitlow (1925), the Supreme Court upheld a conviction but ruled that free speech is protected against the states.', src: 'lii-gitlow' },
      { name: 'James, 31', role: 'Migrated from Mississippi to Chicago', look: 'migrant', story: 'James left a Mississippi farm for a Chicago meatpacking job that pays more than he ever earned. But landlords refuse to rent to him outside a crowded neighborhood.',
        opts: ['The Great Migration and Northern housing discrimination', 'Kellogg-Briand Pact', 'Washington Naval Conference'], a: 0,
        exp: 'About 2 million Black Southerners moved north between the World Wars for jobs and to escape Jim Crow, but faced housing discrimination and segregated neighborhoods in Northern cities.', src: 'nara-migration' },
    ],
  };

  /* -------------------------------------------------------------------
     9. EVIDENCE for the final verdict
     ------------------------------------------------------------------- */
  const EVIDENCE = [
    { id: 'e1', room: 'r1', label: 'Harding’s 1920 landslide', art: 'r1_herald', notes: { mostly: 'Voters overwhelmingly chose calm after war, strikes, and depression — normalcy had a clear public mandate.', partial: 'A landslide shows what voters hoped for, not whether the policies later delivered for everyone.', un: 'Popularity in 1920 does not prove the decade’s policies succeeded.' }, leans: ['mostly'] },
    { id: 'e2', room: 'r1', label: 'The 1920–21 depression ended', art: 'r1_parade', notes: { mostly: 'The sharp postwar depression ended by 1922 and a long boom followed.', partial: 'Recovery came, but historians debate how much government policy caused it.', un: 'Recovery alone does not answer who benefited from it.' }, leans: ['mostly', 'partial'] },
    { id: 'e3', room: 'r2', label: 'Budget and Accounting Act (1921)', art: 'r2_budget', notes: { mostly: 'Harding created a lasting national budget system and an independent auditor — real, durable reform.', partial: 'A genuine reform, though it did not prevent corruption elsewhere in the administration.', un: 'Good budgeting did not stop officials like Fall from abusing public resources.' }, leans: ['mostly', 'partial'] },
    { id: 'e4', room: 'r2', label: 'Mellon tax cuts', art: 'r2_revenue', notes: { mostly: 'Supporters credit the tax cuts with encouraging investment and growth.', partial: 'Growth followed, but the largest benefits went to the wealthy.', un: 'Critics argue the cuts mainly helped the rich and fed speculation.' }, leans: ['mostly', 'partial', 'un'] },
    { id: 'e5', room: 'r2', label: '1922 railroad strike injunction', art: 'r2_wall', notes: { mostly: 'Order was restored and rail service resumed.', partial: 'Stability for business came at the expense of workers’ bargaining power.', un: 'Federal power was used to break a strike, showing normalcy favored employers.' }, leans: ['partial', 'un'] },
    { id: 'e6', room: 'r3', label: 'Teapot Dome bribery', art: 'r3_board', notes: { mostly: 'The system worked: press, Senate, and courts exposed and punished corruption.', partial: 'Corruption happened, but accountability institutions responded.', un: 'A cabinet officer sold public resources for bribes — normalcy concealed serious corruption.' }, leans: ['partial', 'un'] },
    { id: 'e7', room: 'r3', label: 'Senate investigation & McGrain v. Daugherty', art: 'r3_board', notes: { mostly: 'Congress’s power to investigate was strengthened — a lasting safeguard.', partial: 'A positive outcome born from a scandal.', un: 'Safeguards worked only after the damage was done.' }, leans: ['mostly', 'partial'] },
    { id: 'e8', room: 'r4', label: 'Debt cut and budget surpluses', art: 'r4_tax', notes: { mostly: 'The federal debt fell from about $25.5 billion to about $16.9 billion — a frugal, stable government.', partial: 'Fiscal discipline was real, but came with little help for struggling groups.', un: 'Surpluses were chosen over farm relief and other needs.' }, leans: ['mostly', 'partial'] },
    { id: 'e9', room: 'r4', label: 'McNary-Haugen vetoes (farm distress)', art: 'r4_farm', notes: { mostly: 'Coolidge avoided costly price supports that critics feared would cause overproduction.', partial: 'Cities boomed while farmers struggled — prosperity was uneven.', un: 'Farmers were left behind throughout the decade.' }, leans: ['partial', 'un'] },
    { id: 'e10', room: 'r4', label: 'Speculation and the 1929 crash', art: 'r4_ticker', notes: { mostly: 'The crash came after Coolidge left office and had many causes.', partial: 'The boom contained vulnerabilities that policy did not address.', un: 'Overconfidence and speculation helped set up the Great Depression.' }, leans: ['partial', 'un'] },
    { id: 'e11', room: 'r5', label: 'The Dawes Plan', art: 'r5_dawes', notes: { mostly: 'American leadership calmed the German crisis and stabilized Europe for years.', partial: 'It worked temporarily, but depended on continued American lending.', un: 'The system collapsed when U.S. loans stopped — stability was an illusion.' }, leans: ['mostly', 'partial', 'un'] },
    { id: 'e12', room: 'r5', label: 'Washington Naval Conference', art: 'r5_naval', notes: { mostly: 'Real arms limits that saved money and eased tensions.', partial: 'Limits on battleships, but a cruiser race and no enforcement.', un: 'The treaties did not prevent later aggression.' }, leans: ['mostly', 'partial'] },
    { id: 'e13', room: 'r5', label: 'Kellogg-Briand Pact', art: 'r5_kellogg', notes: { mostly: 'Most nations renounced war — a powerful statement of peace.', partial: 'A noble principle without enforcement.', un: 'No enforcement: it failed its first real test in 1931.' }, leans: ['partial', 'un'] },
    { id: 'e14', room: 'r6', label: 'Immigration Act of 1924', art: 'r6_immig', notes: { mostly: 'Supporters believed restriction protected jobs and stability.', partial: 'Stability for some was built on excluding others.', un: 'The law excluded people by national origin and race — normalcy was not for everyone.' }, leans: ['partial', 'un'] },
    { id: 'e15', room: 'r6', label: 'Gitlow v. New York', art: 'r6_gitlow', notes: { mostly: 'Free speech gained protection against state governments.', partial: 'Gitlow lost, but constitutional rights expanded.', un: 'A man was imprisoned for publishing political ideas.' }, leans: ['partial'] },
    { id: 'e16', room: 'r6', label: 'Tulsa 1921 & the failed Dyer bill', art: 'r6_unequal', notes: { mostly: 'The House did pass an anti-lynching bill, and Harding spoke for equal treatment.', partial: 'Some leaders spoke out, but national politics failed to protect Black Americans.', un: 'Racial violence went unpunished and federal protection failed.' }, leans: ['un', 'partial'] },
  ];

  const VERDICTS = {
    mostly: { name: 'Mostly successful', d: 'The policies helped restore confidence and stability after World War I.' },
    partial: { name: 'Partially successful', d: 'The era brought prosperity and stability for some while leaving significant problems unresolved.' },
    un: { name: 'Mostly unsuccessful', d: 'Failures of leadership, corruption, exclusion, and economic vulnerabilities undermined the promise of normalcy.' },
  };

  const FOLLOWUPS = [
    'Which groups benefited most from normalcy? Which faced the greatest disadvantages? (EQ A2)',
    'How did citizens, the press, and Congress hold officials accountable in Teapot Dome? (EQ A1)',
    'Which choices about scarce resources — oil, tax dollars, farm relief — would you have made differently? (EQ C1)',
    'How do historians use primary sources to evaluate presidential leadership? What are the limits of a single source? (EQ D1)',
    'How did examining contrasting perspectives change your view? (EQ D2)',
  ];

  /* -------------------------------------------------------------------
     10. TOWNSFOLK (fictional characters; dialogue gives hints/context)
     ------------------------------------------------------------------- */
  const NPCS = [
    { id: 'guide', name: 'Docent Dot', look: 'guide', fixed: true, lines: [
      'Welcome to the Normalcy Files! This little town blends moments from 1919 to 1929.',
      'Move with WASD or the arrow keys. Press E or Space to talk or examine.',
      'Follow the gold arrow at the top of the screen — it always points to your next exhibit. Start with Exhibit 1, Union Station, to the northwest.',
      'Press M for the map, N for room narration, and Esc to pause. Have fun, historian!'] },
    { id: 'vet', name: 'Returning Veteran (fictional)', look: 'veteran', lines: [
      'Got home from France in ’19. Everybody threw a parade… then everybody asked if I had a job yet.',
      'Prices went up during the war and never came down. Folks around here just want things to settle.'] },
    { id: 'newsboy', name: 'Newsboy (fictional)', look: 'newsboy', lines: [
      'Extra! Extra! Senate committee digs into Navy oil leases! Read all about it at the Daily Ledger!',
      'Mister, a good reporter checks the facts before the headline. That’s what my editor says, anyhow.'] },
    { id: 'biz', name: 'Businessman (fictional)', look: 'businessman', lines: [
      'Lower taxes, a balanced budget, and a government that stays out of my way — that’s normalcy to me.',
      'Mind you, my shop workers might tell you a different story.'] },
    { id: 'farmer', name: 'Farmer (fictional)', look: 'farmer', lines: [
      'Wheat paid well during the war. Now? Prices fell through the floor, and the bank still wants its mortgage.',
      'Everybody talks about prosperity. Not much of it reached my county.'] },
    { id: 'flapper', name: 'Flapper (fictional)', look: 'flapper', lines: [
      'Have you heard a radio yet? The whole country can hear the same program at once — it’s the bee’s knees!',
      'The Bijou down the street shows pictures every night. The twenties sure are roaring for some of us.'] },
    { id: 'cop', name: 'Officer Kelly (fictional)', look: 'police', lines: [
      'Lost, friend? Press M for the town map — you can even travel straight to any exhibit.',
      'Inside a building, walk back onto the doormat at the bottom to come out. Nobody gets stuck on my beat.'] },
    { id: 'immigrant', name: 'Neighbor (fictional)', look: 'immigrant', lines: [
      'My cousin in Naples was supposed to join us. After the new law in ’24, the line for Italian visas is years long.',
      'The Community Hall to the south has a whole exhibit about it.'] },
  ];

  /* -------------------------------------------------------------------
     11. FLAVOR SIGNS around town
     ------------------------------------------------------------------- */
  const SIGNS = {
    bijou: { title: 'The Bijou Picture House', text: 'Movie palaces boomed in the 1920s; silent films gave way to sound after The Jazz Singer (1927). This theater is decorative — the exhibits are in the buildings with numbered banners.' },
    bank: { title: 'First National Bank', text: 'Banks grew rapidly in the 1920s, and many lent money for stocks and consumer goods. This building is decorative. For the economics of the era, visit Exhibit 4 (Treasury & Press Hall).' },
    diner: { title: 'Soda Fountain & Diner', text: 'Under Prohibition (1920–1933), soda fountains and diners boomed. This building is decorative — enjoy the neon!' },
    garage: { title: 'Motor Garage', text: 'Mass production made cars affordable for ordinary families in the 1920s, transforming work and leisure. (Source: ushistory.org, “The Decade That Roared.”)' },
  };

  NF.CONTENT = { TEAM, MEDIA, HELPDESK, EQS, SOURCES, ROOMS, ARTIFACTS, GAMES, EVIDENCE, VERDICTS, FOLLOWUPS, NPCS, SIGNS,
    title: 'THE NORMALCY FILES', subtitle: 'A journey through America’s search for stability after World War I',
    centralQuestion: 'Did America’s return to normalcy restore stability after World War I, or did it conceal deeper problems in American government and society?' };
  NF.src = function (id) { return SOURCES.find((s) => s.id === id); };
})();

-the website is done based on job portal web app
-here the user of job portals the entreprise in resume portal and the entreprise in job portal is the user in resume portal, im basically reversing the roles in this project

! imported tailwind is index.css without deleting preexisting cong
! restored app.css instead of deleting
-potential uneedned assets, imported in assets.js
-application.jsx --> recruits.jsx

-<div>
  <h2>More {JobData.title} Candidates</h2>
  {jobs
    .filter(job => job._id !== JobData._id)
    .filter(job => {
      const jobTitle = job.title.toLowerCase();
      const currentTitle = JobData.title.toLowerCase();
      const currentWords = currentTitle.split(/\s+/);

      // Count the number of matched words
      const matchCount = currentWords.reduce((count, word) => {
        return jobTitle.includes(word) ? count + 1 : count;
      }, 0);

      return matchCount > 0; // Only consider jobs with at least one match
    })
    .map(job => {
      const jobTitle = job.title.toLowerCase();
      const currentTitle = JobData.title.toLowerCase();
      const currentWords = currentTitle.split(/\s+/);

      // Count the number of matched words for sorting
      const matchCount = currentWords.reduce((count, word) => {
        return jobTitle.includes(word) ? count + 1 : count;
      }, 0);

      // Return job with an additional match count for sorting
      return { job, matchCount };
    })
    .sort((a, b) => b.matchCount - a.matchCount) // Sort by match count, descending
    .slice(0, 4)
    .map((item, index) => <JobCard key={index} job={item.job} />)}
</div>
--> were filtering according to title for the most matched words

-here entreprise can import cv, we will try to somehow give that function to the user, most likely now we will just turn off this function
	until we found out if its possible to export/extrapolate/mutate
-and make the job posting page the resume posting page
- we also have to add the resume in applyjob.jsx (equivalent to bookmark resume in our project)
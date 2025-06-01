const Course = require('../models/course');

exports.createCourse = async (req, res) => {
    try {
      const courseData = JSON.parse(req.body.course);
      console.log("📂 Uploaded Files:", req.files.map(f => f.fieldname));

      // Inject uploaded images
      if (Array.isArray(req.files)) {
        req.files.forEach(file => {
          if (file.fieldname === 'coverImage') {
            courseData.coverImage = `/uploads/images/${file.filename}`;
          }
          if (file.fieldname === 'defaultThumbnail') {
            courseData.defaultThumbnail = `/uploads/images/${file.filename}`;
          }
          if (file.fieldname === 'profileImage') {
            courseData.author.profileImage = `/uploads/images/${file.filename}`;
          }
        });
      }
  
      // Nested content/resources
      if (req.files && req.files.length) {
        req.files.forEach(file => {
          const match = file.fieldname.match(/sections\[(\d+)\]\.chapters\[(\d+)\]\.(content|resources)/);
          if (match) {
            const sectionIdx = parseInt(match[1], 10);
            const chapterIdx = parseInt(match[2], 10);
            const fileType = match[3]; // ✅ KEEP AS STRING
        
            const fileMeta = {
              fileName: file.originalname,
              fileUrl: `/uploads/${file.filename}`,
              fileType: file.mimetype,
              fileSize: file.size,
            };
        
            if (fileType === 'content') {
              courseData.sections[sectionIdx].chapters[chapterIdx].content = fileMeta; // ✅ Now it works
            } else if (fileType === 'resources') {
              courseData.sections[sectionIdx].chapters[chapterIdx].resources ||= [];
              courseData.sections[sectionIdx].chapters[chapterIdx].resources.push(fileMeta);
            }
          }
        });        
      }
  
      const course = new Course(courseData);
      await course.save();
      res.status(201).json({ message: 'Course created successfully', course });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  };
  
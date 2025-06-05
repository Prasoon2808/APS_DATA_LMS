const Course = require('../models/course');

exports.createCourse = async (req, res) => {
  try {
    // Parse the non-file part of the form
    const courseData = JSON.parse(req.body.course);

    // Prepare files array (may be empty if no files uploaded)
    const files = Array.isArray(req.files) ? req.files : [];

    // Attach images (cover, thumbnail, profile)
    files.forEach(file => {
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

    // 🧪 Debug: Log file fields
    console.log("📂 Uploaded Files:", files.map(f => f.fieldname));

    // Handle chapter-level file uploads
    files.forEach(file => {
      const match = file.fieldname.match(/sections\[(\d+)\]\.chapters\[(\d+)\]\.(content|resources)/);
      if (match) {
        const sectionIdx = parseInt(match[1], 10);
        const chapterIdx = parseInt(match[2], 10);
        const fileType = match[3];

        const meta = {
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileType: file.mimetype,
          fileSize: file.size
        };

        if (fileType === 'content') {
          courseData.sections[sectionIdx].chapters[chapterIdx].content = meta;
        } else if (fileType === 'resources') {
          courseData.sections[sectionIdx].chapters[chapterIdx].resources ||= [];
          courseData.sections[sectionIdx].chapters[chapterIdx].resources.push(meta);
        }
      }
    });

    // 🔍 Optional log: Final structure before saving
    console.log('🧾 Final courseData:', JSON.stringify(courseData, null, 2));

    // Save to DB
    const course = new Course(courseData);
    await course.save();

    res.status(201).json({ message: 'Course created successfully', course });

  } catch (err) {
    console.error('🔥 ERROR in createCourse:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

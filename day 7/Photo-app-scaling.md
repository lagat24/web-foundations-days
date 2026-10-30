SnapShare: Photo-Sharing App Scaling Plan

1. Assumptions

The following assumptions are used for the calculations:

- Registered users: 10 million.
- Daily active users (DAU): 10% of registered users.
- Each active user uploads 1 photo per day.
- Each active user views 50 feed pages per day.
- Average original photo size: 2 MB.
- Each photo has one thumbnail of 50 KB.
- A day has 86,400 seconds.
- A year has 365 days.
- Traffic is distributed evenly across 24 hours when calculating average request rates.
- Peak traffic is estimated at 5 times the average rate.
- Storage calculations use decimal units (1 MB = 1,000 KB and 1 TB = 1,000 GB).
- Storage estimates exclude backups, replicas and additional metadata.

2. Daily Active Users

10% of 10 million registered users are active daily.

DAU = 10,000,000 × 0.10

DAU = 1,000,000 users

Therefore, SnapShare has approximately 1 million daily active users.

3. Traffic Calculations

Uploads per second

Each active user uploads one photo per day.

Daily uploads = 1,000,000 × 1

Daily uploads = 1,000,000 photos.

Uploads per second:

1,000,000 ÷ 86,400 = 11.57

Average uploads = approximately 11.6 photos per second.

Feed views per second

Each active user views 50 feed pages per day.

Daily feed views = 1,000,000 × 50

Daily feed views = 50,000,000.

Average feed views per second:

50,000,000 ÷ 86,400 = 578.7

Average feed views = approximately 579 per second.

Peak feed views per second

Peak traffic is estimated at 5 times the average traffic.

Peak feed views = 578.7 × 5

Peak feed views = approximately 2,894 per second.

The system should therefore be designed to handle around 2,900 feed requests per second during peak periods.

4. Photo Storage Per Year

Each uploaded photo requires storage for:

- Original photo: 2 MB.
- Thumbnail: 50 KB = 0.05 MB.

Total storage per photo = 2.05 MB.

Daily original photo storage:

1,000,000 × 2 MB = 2,000,000 MB = 2,000 GB.

Daily thumbnail storage:

1,000,000 × 0.05 MB = 50,000 MB = 50 GB.

Total daily storage:

2,000 GB + 50 GB = 2,050 GB.

Annual original photo storage:

2,000 GB × 365 = 730,000 GB = 730 TB.

Annual thumbnail storage:

50 GB × 365 = 18,250 GB = 18.25 TB.

Total annual photo storage = 748.25 TB.

This is the estimated storage required for one year of uploads, excluding backups, replicas and other overhead.

5. Read-Heavy or Write-Heavy?

SnapShare is a read-heavy system.

Each daily active user uploads one photo but views 50 feed pages. This means feed viewing happens much more frequently than photo uploads.

The system must prioritize fast content retrieval and efficient delivery of photos. Caching frequently requested data, using database read replicas and distributing images through a CDN will reduce pressure on the main database and application servers.

6. System Architecture

                   USERS
                     |
                     v
               +-----------+
               |    CDN    |
               +-----------+
                     |
                     v
             +---------------+
             | Load Balancer |
             +---------------+
                     |
          +----------+----------+
          |          |          |
          v          v          v
       +------+   +------+   +------+
       | App  |   | App  |   | App  |
       |Server|   |Server|   |Server|
       +------+   +------+   +------+
          |          |          |
          +----------+----------+
                     |
          +----------+----------+
          |                     |
          v                     v
     +---------+          +-------------+
     |  Cache  |          |  Database   |
     | (Redis) |          | Primary DB  |
     +---------+          +-------------+
                               |
                               v
                         +-------------+
                         | Read Replica|
                         +-------------+

          PHOTO UPLOAD PROCESS
                     |
                     v
              +--------------+
              | Object Storage|
              | Original Photo|
              +--------------+
                     |
                     v
                +---------+
                |  Queue  |
                +---------+
                     |
                     v
                +---------+
                | Worker  |
                |Thumbnail|
                | Creation|
                +---------+
                     |
                     v
              +--------------+
              | Object Storage|
              |  Thumbnail   |
              +--------------+
                     |
                     v
                   CDN

7. Architecture Components

- CDN: Delivers photos and thumbnails from geographically distributed servers, reducing latency and bandwidth pressure on the main application.
- Load Balancer: Distributes incoming requests across available application servers to prevent one server from becoming overloaded.
- Application Servers: Handle user requests, authentication, photo uploads, feed generation and communication with other components.
- Cache (Redis): Stores frequently accessed information, such as popular feed data, to reduce repeated database queries.
- Primary Database: Stores user accounts, relationships, photo metadata and other structured application data.
- Read Replica: Handles read queries separately from the primary database, reducing the workload on the main database.
- Object Storage: Stores original photos and generated thumbnails as files instead of placing large binary files inside the database.
- Queue: Holds background jobs waiting to be processed, allowing photo uploads to complete without waiting for thumbnail generation.
- Worker: Processes queued jobs in the background, generates thumbnails and stores them in object storage.

8. Why Photos Should Not Be Stored Inside the Database

Photos are large binary files that would consume significant database storage if stored directly in database records.

Keeping them in the database would increase database size, make backups more expensive and potentially slow down queries involving structured data.

Instead, original photos and thumbnails should be stored in object storage, such as Amazon S3 or Google Cloud Storage. The database should store their URLs or object keys alongside metadata such as the owner, upload date and file size.

A CDN can then deliver the images efficiently to users without repeatedly accessing the application servers or database.

9. Photo Upload Flow

1. A user selects a photo and requests to upload it through the SnapShare application.
2. The application server authenticates the user and validates the upload request.
3. The application server provides a secure, time-limited upload URL for object storage.
4. The user's device uploads the original photo directly to object storage.
5. After a successful upload, the application server saves the photo metadata and storage location in the primary database.
6. The application server adds a thumbnail-generation job to the queue.
7. A background worker retrieves the job from the queue and downloads or accesses the original photo.
8. The worker generates a smaller 50 KB thumbnail and saves it in object storage.
9. The thumbnail's storage location is saved in the database.
10. The CDN delivers the original photo and thumbnail when users request them.

This approach allows users to upload photos without waiting for thumbnail generation to finish.

10. System Design Trade-offs

1. Caching vs Data Freshness

Caching reduces database queries and improves feed loading speed. However, cached information may become outdated when a user uploads a new photo or changes their profile. The system needs a cache expiration or invalidation strategy to keep information reasonably fresh.

2. Database Read Replicas vs Consistency

Read replicas allow the system to handle more read requests without overloading the primary database. However, replication may introduce a delay before new data becomes available on the replica. This means users might not immediately see their latest uploads when reading from a replica.

3. Object Storage and CDN vs Cost

Object storage and CDNs make photo delivery more scalable and faster. However, storing hundreds of terabytes of photos and delivering them through a CDN introduces ongoing storage and bandwidth costs.

4. Background Processing vs Immediate Availability

Using a queue and background workers makes uploads faster because thumbnail generation happens separately. However, thumbnails may not be available immediately after an upload. The application must handle this temporary delay gracefully.

Conclusion

SnapShare needs a read-optimized and horizontally scalable architecture because feed views significantly outnumber photo uploads. Using a CDN, caching, database read replicas and object storage will help the system handle high traffic efficiently. Background workers and queues will also ensure that expensive image-processing tasks do not slow down the upload experience.

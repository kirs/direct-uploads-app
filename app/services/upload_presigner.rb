class UploadPresigner
  def self.presign_upload(prefix, filename)
    extname = File.extname(filename)
    filename = "#{SecureRandom.uuid}#{extname}"
    upload_key = Pathname.new(prefix).join(filename)

    creds = Aws::Credentials.new(ENV['AWS_KEY'], ENV['AWS_SECRET'])
    s3 = Aws::S3::Resource.new(region: 'us-west-1', credentials: creds)
    obj = s3.bucket('onboardiq-applicant-uploads').object(upload_key)

    {
      presigned_url: obj.presigned_url(:put, acl: 'public-read'),
      public_url: obj.public_url
    }
  end

end

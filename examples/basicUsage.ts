import 'dotenv/config';
import { PrintingAssistantOrchestrator, PrintingIssue } from '../src/index';

async function runExample() {
  console.log('🖨️  Starting Printing AI Assistant Example\n');

  // Initialize the assistant from environment variables
  const assistant = PrintingAssistantOrchestrator.createFromEnv();

  // Verify SMTP connection
  console.log('Verifying SMTP connection...');
  const connected = await assistant.verifySetup();
  if (!connected) {
    console.error('❌ SMTP connection failed. Please check your configuration.');
    process.exit(1);
  }
  console.log('✅ SMTP connection verified\n');

  // Example printing issues
  const issues: PrintingIssue[] = [
    {
      id: 'issue-001',
      title: 'Color Mismatch in Large Format Print',
      notes: `Client noticed significant color deviation in blues and greens on a large format 
      banner print. The colors appear more muted and desaturated compared to the approved proof. 
      This is affecting brand consistency for their retail display. The job uses CMYK separations.`,
      createdAt: new Date()
    },
    {
      id: 'issue-002',
      title: 'Paper Quality and Substrate Issues',
      notes: `Materials supplier changed paper stock due to supply constraints. 
      The new substrate has different texture and brightness characteristics. 
      Client is concerned about consistency across the print run and effects on color reproduction.`,
      createdAt: new Date()
    },
    {
      id: 'issue-003',
      title: 'Production Timeline Delay',
      notes: `Equipment maintenance schedules are causing delays in job turnaround. 
      We need to optimize scheduling to prevent future client delays. 
      Current workflow has bottlenecks in the finishing department.`,
      createdAt: new Date()
    }
  ];

  // Process single issue
  console.log('📧 Processing single issue example...\n');
  const singleResult = await assistant.processSingleIssue(
    issues[0],
    'john@example.com',
    'John Smith'
  );

  if (singleResult) {
    console.log('✅ Single issue processed and email sent successfully\n');
  } else {
    console.log('❌ Failed to process single issue\n');
  }

  // Process bulk issues
  console.log('📧 Processing bulk issues...\n');
  const bulkRequests = [
    {
      issue: issues[0],
      clientEmail: 'john@example.com',
      clientName: 'John Smith'
    },
    {
      issue: issues[1],
      clientEmail: 'sarah@example.com',
      clientName: 'Sarah Johnson'
    },
    {
      issue: issues[2],
      clientEmail: 'mike@example.com',
      clientName: 'Mike Davis'
    }
  ];

  const results = await assistant.processBulkIssues(bulkRequests);

  console.log(`\n✅ Bulk processing complete:`);
  console.log(`   Successful: ${results.successful}`);
  console.log(`   Failed: ${results.failed}`);
  if (results.errors.length > 0) {
    console.log('   Errors:');
    results.errors.forEach(err => console.log(`   - ${err}`));
  }

  console.log('\n🎉 Example completed successfully!');
}

// Run the example
runExample().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

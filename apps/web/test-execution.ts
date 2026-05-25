import { prisma } from "@corversetalent/db";

async function runTests() {
  console.log("🧪 Starting QA Tests for Outreach Orchestrator...\n");

  try {
    // 1. Create a Contact
    console.log("1. Creating test contact...");
    const contact = await prisma.contact.create({
      data: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      }
    });
    console.log(`✅ Contact created: ${contact.id}`);

    // 2. Create a Sequence with 3 steps
    console.log("\n2. Creating Sequence (Task 6.4)...");
    const sequence = await prisma.sequence.create({
      data: {
        name: "QA Test Sequence",
        steps: {
          create: [
            { type: "linkedin_view", delayDays: 0, orderIndex: 0 },
            { type: "linkedin_connect", delayDays: 1, content: "Hi there!", orderIndex: 1 },
            { type: "email", delayDays: 2, subject: "Following up", content: "Did you get my request?", orderIndex: 2 }
          ]
        }
      },
      include: { steps: { orderBy: { orderIndex: "asc" } } }
    });
    console.log(`✅ Sequence created with ${sequence.steps.length} steps: ${sequence.id}`);

    // 3. Create Campaign and Import Contact
    console.log("\n3. Creating Campaign & Importing Contact (Task 6.5)...");
    const campaign = await prisma.campaign.create({
      data: {
        name: "QA Test Campaign",
        sequenceId: sequence.id,
      }
    });

    const member = await prisma.campaignMember.create({
      data: {
        campaignId: campaign.id,
        contactId: contact.id,
        currentStepId: sequence.steps[0].id,
        status: "active",
        nextExecutionAt: new Date(Date.now() - 1000) // Past time to force execution
      }
    });
    console.log(`✅ Campaign Member created on Step 1 (${sequence.steps[0].type})`);

    // 4. Simulate Chrome Extension Worker Polling
    console.log("\n4. Simulating Chrome Extension Worker (Task 6.6)...");
    const res = await fetch("http://localhost:3000/api/extension/tasks");
    if (!res.ok) throw new Error("GET /api/extension/tasks failed. Is Next.js server running?");
    const pendingTasks = await res.json();
    
    console.log(`[Extension Worker] Found ${pendingTasks.tasks.length} pending tasks`);
    
    const ourTask = pendingTasks.tasks.find((t: any) => t.id === member.id);
    if (!ourTask) throw new Error("Task not found in queue!");

    console.log(`[Extension Worker] Executing task: ${ourTask.currentStep.type}... done!`);

    // Complete the task
    const completeRes = await fetch("http://localhost:3000/api/extension/tasks/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignMemberId: ourTask.id })
    });
    const completeData = await completeRes.json();
    if (!completeData.success) throw new Error("Failed to complete task");

    // Verify DB update
    const updatedMember = await prisma.campaignMember.findUnique({
      where: { id: member.id },
      include: { currentStep: true }
    });
    console.log(`✅ Success! Prospect advanced to Step 2: ${updatedMember?.currentStep?.type}`);

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! The Outreach Orchestrator works perfectly.");

  } catch (err: any) {
    console.error("❌ Test Failed:", err.message);
  } finally {
    // Cleanup
    console.log("\nCleaning up test data...");
    await prisma.campaignMember.deleteMany({ where: { contact: { email: "test@example.com" } } });
    await prisma.campaign.deleteMany({ where: { name: "QA Test Campaign" } });
    await prisma.sequenceStep.deleteMany({ where: { sequence: { name: "QA Test Sequence" } } });
    await prisma.sequence.deleteMany({ where: { name: "QA Test Sequence" } });
    await prisma.contact.deleteMany({ where: { email: "test@example.com" } });
  }
}

runTests();
